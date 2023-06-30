const { Sequelize } = require('sequelize');

module.exports = function (sequelize) {
  return sequelize.define(
    'reservation_state',
    {
      state: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      reservation_grouping_uuid: {
        type: Sequelize.STRING,
        primaryKey: true
      }
    },
    {
      freezeTableName: true
    }
  );
};
