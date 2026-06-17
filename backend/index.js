const express = require('express');
const cors = require('cors');
const stockRoutes = require('./routes/stocks.js');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/stocks', stockRoutes);

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
