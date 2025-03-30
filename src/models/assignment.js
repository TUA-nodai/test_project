module.exports = (sequelize, DataTypes) => {
    const Assignment = sequelize.define('Assignment', {
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
      date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      task: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      client_name: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      total_transport_cost: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      quantity: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      sales_amount: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      order_number: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      site_name: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      hours: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      unit_price: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      person_in_charge: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    }, {
      tableName: 'assignments',
      underscored: false,
      timestamps: true,
      createdAt: 'createdat',
      updatedAt: 'updatedat'
    });
  
    Assignment.associate = (models) => {
      // 担当者（ユーザー）との関連
      if (models.User) {
        Assignment.belongsTo(models.User, {
          foreignKey: 'person_in_charge',
          targetKey: 'objectid',
          as: 'personInCharge'
        });
      }
    };
    
    return Assignment;
  };
  