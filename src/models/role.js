module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
      objectid: {
        type: DataTypes.STRING(255),
        primaryKey: true,
        allowNull: false
      },
      createdat: {
        type: DataTypes.DATE,
        allowNull: true
      },
      updatedat: {
        type: DataTypes.DATE,
        allowNull: true
      },
      acl: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true
      }
    }, {
      tableName: 'roles',
      underscored: false,
      timestamps: true,
      createdAt: 'createdat',
      updatedAt: 'updatedat'
    });
  
    Role.associate = (models) => {
      // ロールとユーザーの多対多関連
      if (models.User) {
        Role.belongsToMany(models.User, {
          through: 'user_roles',
          foreignKey: 'role_id',
          otherKey: 'user_id'
        });
      }
      
      // ロールの階層構造（親子関係）
      if (models.Role) {
        Role.belongsToMany(models.Role, {
          through: 'role_roles',
          as: 'childRoles',
          foreignKey: 'parent_role_id',
          otherKey: 'child_role_id'
        });
        
        Role.belongsToMany(models.Role, {
          through: 'role_roles',
          as: 'parentRoles',
          foreignKey: 'child_role_id',
          otherKey: 'parent_role_id'
        });
      }
    };
    
    return Role;
  };
  