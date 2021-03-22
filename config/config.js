const dotenv = require("dotenv");
dotenv.config();

const config = {
  development: {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "mysurpin_dev",
    dialect: "mysql",
    timezone: "+09:00",
  },
  production: {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "mysurpin",
    dialect: "mysql",
    timezone: "+09:00",
  },
};

module.exports = config;
