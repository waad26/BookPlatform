const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize('BookSharing_DB', 'root', '2410972', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;

sequelize.authenticate()
  .then(() => console.log('Database connection successful!'))
  .catch(err => {
    const errorLogPath = path.join(__dirname, 'error.log');
    const errorMessage = `[${new Date().toISOString()}] Database connection error: ${err.message}\n`;
    
    fs.appendFileSync(errorLogPath, errorMessage);
    console.error('Database connection failed. Check error.log for details.'); 
  });
