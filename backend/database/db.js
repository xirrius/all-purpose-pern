const Pool = require("pg").Pool;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
  ssl: {
    rejectUnauthorized: false, // Required for connecting to Render's managed PostgreSQL
  },
});

module.exports = pool;
