const express = require('express');
const cors = require('cors');
const stockRoutes = require('./routes/stocks.js');
const favoriteRoutes = require('./routes/favorites.js');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/stocks', stockRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/favorites', favoriteRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
