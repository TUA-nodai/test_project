module.exports = (sequelize, DataTypes) => {
  const EmployeePayroll = sequelize.define('EmployeePayroll', {
    objectid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    employee: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'objectid'
      }
    },
    payroll: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'payroll',
        key: 'objectid'
      }
    }
  }, {
    tableName: 'employee_payroll',
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat'
  });

  return EmployeePayroll;
};
