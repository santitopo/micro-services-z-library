const { Sequelize } = require('sequelize');

module.exports = function (sequelize) {
  return sequelize.define(
    'book',
    {
      title: { type: Sequelize.STRING },
      isbn: { type: Sequelize.STRING, unique: 'compositeIndex' },
      authors: { type: Sequelize.STRING },
      year: { type: Sequelize.INTEGER },
      is_deleted: { type: Sequelize.BOOLEAN },
      quantity: { type: Sequelize.INTEGER },
      times_read: { type: Sequelize.INTEGER },
      organization_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: 'compositeIndex'
      }
    },
    {
      freezeTableName: true
    }
  );
};
