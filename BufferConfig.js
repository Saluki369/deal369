const Sequelize = require('sequelize');
const db = require('../config/database');

const BufferConfig = db.define('bufferConfig', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  accessToken: {
    type: Sequelize.STRING,
    allowNull: false
  },
  refreshToken: {
    type: Sequelize.STRING,
    allowNull: true
  },
  tokenExpiry: {
    type: Sequelize.DATE,
    allowNull: true
  },
  profileIds: {
    type: Sequelize.TEXT, // Stored as JSON string
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('profileIds');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('profileIds', JSON.stringify(value));
    }
  },
  status: {
    type: Sequelize.ENUM('active', 'expired', 'revoked'),
    defaultValue: 'active'
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

module.exports = BufferConfig;
