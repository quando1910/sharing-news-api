const path = require('path');

require('dotenv-safe').config({
  allowEmptyValues: true,
  path: path.join(__dirname, '../.env')
});

module.exports = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: 'postgres',
  seederStorage: 'sequelize',
  seederStorageTableName: 'Seeder',
  autoMigrateOldSchema: true,
  
};
