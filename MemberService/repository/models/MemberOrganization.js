const { Sequelize } = require('sequelize');

module.exports = function (sequelize) {
  return sequelize.define(
    'member_organization',
    {
      organization_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
        // references: {
        //   model: 'organization',
        //   key: 'id'
        // }
      },
      member_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'member',
          key: 'id'
        }
      },
      is_admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      pending_invite: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      mail_notifications: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      }
    },
    {
      freezeTableName: true
    }
  );
};
