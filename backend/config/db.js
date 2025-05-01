// config/db.js

const { Sequelize } = require('sequelize');

// إعداد الاتصال بقاعدة البيانات
const sequelize = new Sequelize({
  dialect: 'mysql', // أو أي قاعدة بيانات تستخدمها
  host: 'localhost', // أو عنوان الخادم
  username: 'root',
  password: '2410972',
  database: 'bookplatform_test',
});

module.exports = sequelize;
