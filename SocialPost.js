const Sequelize = require('sequelize');
const db = require('../config/database');

const SocialPost = db.define('socialPost', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  platform: {
    type: Sequelize.ENUM('facebook', 'twitter', 'instagram', 'linkedin', 'pinterest'),
    allowNull: false
  },
  mediaUrl: {
    type: Sequelize.STRING,
    allowNull: true
  },
  scheduledDate: {
    type: Sequelize.DATE,
    allowNull: true
  },
  publishedDate: {
    type: Sequelize.DATE,
    allowNull: true
  },
  status: {
    type: Sequelize.ENUM('draft', 'scheduled', 'published', 'failed'),
    defaultValue: 'draft'
  },
  bufferId: {
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

module.exports = SocialPost;
