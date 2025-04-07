const Sequelize = require('sequelize');
const db = require('../config/database');

const EmailTemplate = db.define('emailTemplate', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  subject: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  type: {
    type: Sequelize.ENUM('welcome', 'nurture', 'promotion', 'follow-up', 'custom'),
    defaultValue: 'custom'
  },
  status: {
    type: Sequelize.ENUM('active', 'inactive', 'draft'),
    defaultValue: 'draft'
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

module.exports = EmailTemplate;
