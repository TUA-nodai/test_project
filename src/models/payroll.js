module.exports = (sequelize, DataTypes) => {
  const Payroll = sequelize.define('Payroll', {
    objectid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    hours: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    client_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    task: {
      type: DataTypes.STRING,
      allowNull: true
    },
    person_in_charge: {
      type: DataTypes.STRING,
      allowNull: true
    },
    site_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    order_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    quantity: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }
  }, {
    tableName: 'payroll',
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat'
  });

  Payroll.associate = (models) => {
    Payroll.belongsToMany(models.Employee, { 
      through: models.EmployeePayroll,
      foreignKey: 'payroll',
      otherKey: 'employee',
      as: 'employees'
    });
  };

  return Payroll;
};
