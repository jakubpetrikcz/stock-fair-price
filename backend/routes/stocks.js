const { Router } = require('express');
const { execFile } = require('node:child_process');
const path = require('node:path');
const pool = require('../db.js');

const router = Router();
const PYTHON_BIN = process.env.PYTHON_BIN || 'python3';
const getStockPriceScript = path.join(
  __dirname,
  '..',
  'services',
  'get_stock_price.py',
);

const fetchStockPrice = (ticker) =>
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

router.get('/', async (req, res) => {
  try {
    const getStocks = await pool.query('SELECT * FROM sec_companies');
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

module.exports = router;
