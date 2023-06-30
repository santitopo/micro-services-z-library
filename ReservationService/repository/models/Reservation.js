const { Sequelize } = require('sequelize');

module.exports = function (sequelize) {
  return sequelize.define(
    'reservation',
    {
      book_id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      member_id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      grouping_uuid: {
        type: Sequelize.STRING
      },
      date: { type: Sequelize.DATE, primaryKey: true }
    },
    {
      freezeTableName: true
    }
  );
};
