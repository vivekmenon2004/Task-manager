const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

function describeError(error) {
  const causes = Array.isArray(error.errors)
    ? error.errors.map((cause) => cause.message || cause.code).filter(Boolean).join('; ')
    : '';

  return [error.code, error.message, causes].filter(Boolean).join(': ') || String(error);
}

pool.on('error', (error) => {
  console.error('PostgreSQL pool error:', describeError(error));
});

pool.connect()
  .then((client) => {
    client.release();
    console.log('Successfully connected to PostgreSQL.');
  })
  .catch((error) => {
    console.error('Failed to connect to PostgreSQL:', describeError(error));
  });

const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };
