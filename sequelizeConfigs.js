const fs = require('fs');
const configs = require('./configs');
require('dotenv').config();

module.exports = {
  development: {
    username: configs.db.user,
    password: configs.db.password,
    database: configs.db.name,
    host: configs.db.host,
    port: configs.db.port,
    dialect: configs.db.dialect,
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(process.env.DB_SSL_CA_PATH).toString(),
      },
    },
  },
  test: {
    username: configs.db.user,
    password: configs.db.password,
    database: configs.db.name,
    host: configs.db.host,
    port: configs.db.port,
    dialect: configs.db.dialect,
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(process.env.DB_SSL_CA_PATH).toString(),
      },
    },
  },
  production: {
    username: configs.db.user,
    password: configs.db.password,
    database: configs.db.name,
    host: configs.db.host,
    port: configs.db.port,
    dialect: configs.db.dialect,
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(process.env.DB_SSL_CA_PATH).toString(),
      },
    },
  },
};
