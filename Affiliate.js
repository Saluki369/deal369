const Sequelize = require('sequelize');
const db = require('../config/database');

const Affiliate = db.define('affiliate', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  company: {
    type: Sequelize.STRING,
    allowNull: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: true
  },
  website: {
    type: Sequelize.STRING,
    allowNull: true
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  affiliateLink: {
    type: Sequelize.STRING,
    allowNull: false
  },
  commissionRate: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  paymentMethod: {
    type: Sequelize.STRING,
    allowNull: true
  },
  paymentDetails: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  status: {
    type: Sequelize.ENUM('active', 'inactive', 'pending'),
    defaultValue: 'pending'
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
});

module.exports = Affiliate;
