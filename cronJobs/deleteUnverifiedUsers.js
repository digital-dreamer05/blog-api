const cron = require('node-cron');
const { Op } = require('sequelize');
const { User } = require('../db');

cron.schedule('0 3 * * *', async () => {
  console.log('🧹 Cleaning up unverified users...');

  const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const deletedCount = await User.destroy({
    where: {
      isVerified: false,
      createdAt: { [Op.lt]: cutoffDate },
    },
  });

  console.log(`🗑️ Deleted ${deletedCount} unverified users.`);
});
