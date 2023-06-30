const { Sequelize } = require('sequelize');

module.exports = function (sequelize) {
  return sequelize.define(
    'member',
    {
      name: { type: Sequelize.STRING },
      lastname: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING, unique: true },
      password: { type: Sequelize.STRING }
    },
    {
      freezeTableName: true
    }
  );
};
