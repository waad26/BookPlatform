const {DataTypes} = require('sequelize');
const sequelize = require('../../config/db');
const bcrypt = require("bcryptjs");


const User = sequelize.define('User',
  {
    name : {
        type: DataTypes.STRING(100),
        allowNull : false
    },
    
    UserName : {
        type : DataTypes.STRING(50),
        allowNull : false ,
        unique : true
    },

    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8, 100]
        }
      },

      role: {
        type: DataTypes.STRING,
        defaultValue: 'user',
        validate: {
          isIn: [['user', 'admin', 'blocked']]
        }
      },
    
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },

    emailVerificationToken: {
        type: DataTypes.STRING,
        allowNull: true
      },

    isBlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },

    resetToken: {
        type: DataTypes.STRING,
        allowNull: true
      },

      resetTokenExpiry: {
        type: DataTypes.DATE,
        allowNull: true
      }
  
    },
    
    {
      timestamps: true 
    }
  );

    User.beforeCreate(async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      });

    User.beforeUpdate(async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
    });

    module.exports = User ; 