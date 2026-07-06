const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const poolConfig =
  process.env.NODE_ENV === 'development'
    ? {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE,
      }
    : {
        connectionString: process.env.DATABASE_URL,
        ssl:
          process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false,
      };

const pool = new Pool(poolConfig);

module.exports = pool;
