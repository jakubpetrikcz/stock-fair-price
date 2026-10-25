const { Router } = require('express');
const pool = require('../config/dbConfig.js');
const protect = require('../middleware/auth.js');

const router = Router();

router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const getFavoriteStocks = await pool.query(
      `
      SELECT
        favorites.id,
        favorites.company_id,
        favorites.user_id,
        sec_companies.ticker,
        sec_companies.name,
        sec_companies.dcf_fair_value
      FROM favorites
      JOIN sec_companies
        ON sec_companies.id = favorites.company_id
      WHERE favorites.user_id = $1
      ORDER BY favorites.id
    `,
      [userId],
    );
    res.json(getFavoriteStocks.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const getFavorite = await pool.query(
      'SELECT * FROM favorites WHERE company_id = $1 AND favorites.user_id = $2',
      [id, userId],
    );
    res.json(getFavorite.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Favorite stock is unavailable');
  }
});

router.post('/', async (req, res) => {
  try {
    const { companyId, userId } = req.body;
    const newFavoriteStock = await pool.query(
      'INSERT INTO favorites (company_id, user_id) VALUES($1, $2)',
      [companyId, userId],
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
