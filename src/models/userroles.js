module.exports = (sequelize, DataTypes) => {
    const UserRoles = sequelize.define('UserRoles', {
      role_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
          model: 'roles',
          key: 'objectid'
        }
      },
      user_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
          model: 'users',
          key: 'objectid'
        }
      }
    }, {
      tableName: 'user_roles',
      underscored: false,
    });
  
    return UserRoles;
  };
  