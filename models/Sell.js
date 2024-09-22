module.exports = (sequelize, DataTypes) => {
  const Sell = sequelize.define('Sell', {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2), // Keep the precision for currency values
      allowNull: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',  // Make sure this matches the 'Products' table name exactly
        key: 'id'
      }
    }
  }, {
    timestamps: true  // This adds createdAt and updatedAt columns
  });

  // Associate Sell with Product
  Sell.associate = (models) => {
    Sell.belongsTo(models.Product, { foreignKey: 'product_id' });
  };

  return Sell;
};
