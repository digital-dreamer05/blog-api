require('dotenv').config();

const { db } = require('./db');
const app = require('./app');
const config = require('./configs');
const redis = require('./redis');

async function startServer() {
  try {
    await db.authenticate();
    await redis.ping();

    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}...`);
    });
  } catch (err) {
    console.error('Error -->', err);

    await db.close();
    await redis.disconnect();
  }
}

startServer();

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
