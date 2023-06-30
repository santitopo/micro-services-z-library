const { Sequelize } = require('sequelize');

module.exports = function (sequelize) {
  return sequelize.define(
    'organization',
    {
      name: { type: Sequelize.STRING, unique: true },
      api_key: { type: Sequelize.STRING, unique: true }
    },
    {
      freezeTableName: true
    }
  );
};
