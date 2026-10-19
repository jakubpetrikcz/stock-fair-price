const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const poolConfig = {
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: false,
};

const pool = new Pool(poolConfig);

module.exports = pool;
