const Sequelize = require('sequelize');
const db = require('../config/database');

const EmailCampaign = db.define('emailCampaign', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  status: {
    type: Sequelize.ENUM('active', 'paused', 'completed', 'draft'),
    defaultValue: 'draft'
  },
  startDate: {
    type: Sequelize.DATE,
    allowNull: true
  },
  endDate: {
    type: Sequelize.DATE,
    allowNull: true
  },
  affiliateId: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'affiliates',
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

module.exports = EmailCampaign;
