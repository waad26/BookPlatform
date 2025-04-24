const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('BookSharing_DB', 'root', '2410972', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;

sequelize.authenticate()
  .then(() => console.log('Connection successful!'))
  .catch(err => console.error('Unable to connect:', err));
