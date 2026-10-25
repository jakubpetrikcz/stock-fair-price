const express = require('express');
const cors = require('cors');
const stockRoutes = require('./routes/stocks.js');
const favoriteRoutes = require('./routes/favorites.js');
const userRoutes = require('./routes/users.js');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

console.log('process.env.CLIENT_URL', process.env.CLIENT_URL);
console.log('PORT', PORT);

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use('/stocks', stockRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
