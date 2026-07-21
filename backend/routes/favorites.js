const { Router } = require('express');
const pool = require('../db.js');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const getFavoriteStocks = await pool.query(`
      SELECT
        favorites.id,
        favorites.company_id,
        favorites.dcf_fair_value,
        sec_companies.ticker,
        sec_companies.name
      FROM favorites
      JOIN sec_companies
        ON sec_companies.id = favorites.company_id
      ORDER BY id
    `);
    res.json(getFavoriteStocks.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const getFavorite = await pool.query(
      'SELECT * FROM favorites WHERE company_id = $1',
      [id],
    );
    res.json(getFavorite.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Favorite stock is unavailable');
  }
});

router.post('/', async (req, res) => {
  try {
    const { companyId, fairPrice } = req.body;
    const newFavoriteStock = await pool.query(
      'INSERT INTO favorites (company_id, dcf_fair_value) VALUES($1, $2)',
      [companyId, fairPrice],
    );
    res.json(newFavoriteStock);
  } catch (error) {
    console.error(error.message);
    res.status(503).json({ error: 'Saving new favorite stock failed' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteFavoriteStock = await pool.query(
      'DELETE FROM favorites WHERE id = $1',
      [id],
    );
    res.json('Favorite stock was deleted');
  } catch (error) {
    console.error(error.message);
    res.status(503).json({ error: 'Deleting favorite stock failed' });
  }
});

module.exports = router;
