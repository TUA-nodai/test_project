module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    objectid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    other: {
      type: DataTypes.STRING,
      allowNull: true
    },
    base_rate: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    transport_cost: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    additional_transport_cost: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }
  }, {
    tableName: 'employees',
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat'
  });

  Employee.associate = (models) => {
    Employee.belongsToMany(models.Payroll, { 
      through: models.EmployeePayroll,
      foreignKey: 'employee',
      otherKey: 'payroll',
      as: 'payrolls'
    });
  };

  return Employee;
};
