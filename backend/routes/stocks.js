const { Router } = require('express');
const { execFile } = require('node:child_process');
const path = require('node:path');
const pool = require('../config/dbConfig.js');
const roundToMillions = require('../utils/roundToMillions.js');
const getFutureFcfs = require('../utils/getFutureFcfs.js');
const calculateDcfFairPrice = require('../utils/calculateDcfFairPrice.js');

const router = Router();
const PYTHON_BIN = process.env.PYTHON_BIN || 'python3';
const getStockPriceScript = path.join(
  __dirname,
  '..',
  'api',
  'get_stock_price.py',
);

const fetchStockPriceFromApi = async (ticker) => {
  const response = await fetch(
    `${process.env.PRICE_API_URL}?ticker=${encodeURIComponent(ticker)}`,
  );

  const body = await response.text();
  let data;

  try {
    data = JSON.parse(body);
  } catch {
    throw new Error(
      `Price API returned NON-JSON response (${response.status}): ${body}`,
    );
  }

  if (!response.ok) {
    throw new Error(data.error || 'Current stock price is unavailable');
  }

  return data;
};

const fetchStockPriceFromScript = (ticker) =>
  new Promise((resolve, reject) => {
    execFile(
      PYTHON_BIN,
      [getStockPriceScript, ticker],
      { timeout: 10000 },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr.trim() || error.message));
          return;
        }

        try {
          resolve(JSON.parse(stdout));
        } catch (parseError) {
          reject(parseError);
        }
      },
    );
  });

const fetchStockPrice = (ticker) => {
  if (process.env.PRICE_API_URL) {
    return fetchStockPriceFromApi(ticker);
  }

  return fetchStockPriceFromScript(ticker);
};

router.get('/', async (req, res) => {
  try {
    const getStocks = await pool.query(
      'SELECT * FROM sec_companies ORDER BY ID',
    );
    res.json(getStocks.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const getStock = await pool.query(
      'SELECT * FROM sec_companies WHERE ticker = $1',
      [ticker],
    );
    res.json(getStock.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Current ticker is unavailable');
  }
});

router.get('/:ticker/price', async (req, res) => {
  try {
    const { ticker } = req.params;

    if (!/^[A-Z0-9.-]{1,15}$/.test(ticker)) {
      return res.status(400).json({ error: 'Invalid ticker symbol' });
    }

    const price = await fetchStockPrice(ticker);

    res.json(price);
  } catch (error) {
    console.error(error.message);
    res.status(503).json({ error: 'Current stock price is unavailable' });
  }
});

router.put('/:ticker/dcf', async (req, res) => {
  try {
    const { ticker } = req.params;
    const { userGrowthRate } = req.body;

    const getStock = await pool.query(
      'SELECT * FROM sec_companies WHERE ticker = $1',
      [ticker],
    );
    const stock = getStock.rows[0];

    const freeCashFlows = stock['free_cash_flow'];
    const cashEquivalents = roundToMillions(Number(stock['cash_equivalents']));
    const totalDebt = roundToMillions(Number(stock['total_debt']));
    const sharesOutstanding = roundToMillions(
      Number(stock['shares_outstanding']),
      1,
    );

    const cashFlow = freeCashFlows
      .map((item) => ({
        cashFlow: roundToMillions(item.value),
      }))
      .reverse();

    const cashFlows = cashFlow.map((cashFlow) => cashFlow.cashFlow);

    const futureFcfs = getFutureFcfs(cashFlows, userGrowthRate);

    const fairPrice = calculateDcfFairPrice(
      cashEquivalents,
      totalDebt,
      sharesOutstanding,
      futureFcfs,
    );

    await pool.query(
      'UPDATE sec_companies SET dcf_growth_rate = $2, dcf_fair_value = $3, dcf_future_fcfs = $4 WHERE ticker = $1',
      [ticker, userGrowthRate, fairPrice, futureFcfs],
    );

    res.json({ futureFcfs, fairPrice });
  } catch (error) {
    console.error(error.message);
    res.status(503).json({ error: 'DCF price is unavailable' });
  }
});

module.exports = router;
