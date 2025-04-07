const Sequelize = require('sequelize');
const db = require('../config/database');

const LandingPage = db.define('landingPage', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  metaTitle: {
    type: Sequelize.STRING,
    allowNull: true
  },
  metaDescription: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  headerImage: {
    type: Sequelize.STRING,
    allowNull: true
  },
  template: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'default'
  },
  status: {
    type: Sequelize.ENUM('published', 'draft', 'archived'),
    defaultValue: 'draft'
  },
  conversionGoal: {
    type: Sequelize.STRING,
    allowNull: true
  },
  affiliateId: {
    type: Sequelize.INTEGER,
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

module.exports = LandingPage;
