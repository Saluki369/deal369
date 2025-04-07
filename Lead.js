const Sequelize = require('sequelize');
const db = require('../config/database');

const Lead = db.define('lead', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
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
  source: {
    type: Sequelize.STRING,
    allowNull: true
  },
  status: {
    type: Sequelize.ENUM('new', 'contacted', 'qualified', 'converted', 'lost'),
    defaultValue: 'new'
  },
  notes: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  affiliateId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'affiliates',
      key: 'id'
    }
  },
  landingPageId: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'landingPages',
      key: 'id'
    }
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

module.exports = Lead;
