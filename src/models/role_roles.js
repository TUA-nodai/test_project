module.exports = (sequelize, DataTypes) => {
  const RoleRoles = sequelize.define('RoleRoles', {
    parent_role_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: 'roles',
        key: 'objectid'
      }
    },
    child_role_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: 'roles',
        key: 'objectid'
      }
    }
  }, {
    tableName: 'role_roles',
    underscored: false,
  });

  return RoleRoles;
};
