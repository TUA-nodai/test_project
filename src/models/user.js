module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    objectid: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`
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
    username: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: {
        msg: 'このユーザー名は既に使用されています'
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    emailverified: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    authdata: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  }, {
    tableName: 'users',
    underscored: false,
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat'
  });
  
  // モデル関連付けの定義
  User.associate = (models) => {
    // ユーザーとロールの多対多関連（user_rolesテーブルを介して）
    if (models.Role) {
      User.belongsToMany(models.Role, { 
        through: 'user_roles',
        foreignKey: 'user_id',
        otherKey: 'role_id',
        as: 'roles'
      });
    }
    
    // ユーザーと給与情報（payroll）の1対多関連（person_in_chargeを通じて）
    if (models.Payroll) {
      User.hasMany(models.Payroll, {
        foreignKey: 'person_in_charge',
        sourceKey: 'objectid',
        as: 'payrolls'
      });
    }
    
    // ユーザーと割り当て（assignments）の1対多関連（person_in_chargeを通じて）
    if (models.Assignment) {
      User.hasMany(models.Assignment, {
        foreignKey: 'person_in_charge',
        sourceKey: 'objectid',
        as: 'assignments'
      });
    }
  };
  
  return User;
};
