const { Router } = require('express');
const pool = require('../db.js');

const router = Router();

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
    res.json(getStock.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
