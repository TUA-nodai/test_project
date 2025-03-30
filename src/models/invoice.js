module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define('Invoice', {
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
    quantity: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    order_number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    unit_price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'invoices',
    underscored: false,
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat'
  });

  return Invoice;
};
