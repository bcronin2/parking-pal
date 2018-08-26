const { Pool } = require("pg");

const pool = new Pool({
  database: "parking_pal_db",
  port: 5432
});

module.exports = pool;
