module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    productName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    productPrice: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    productImage: {
      type: DataTypes.STRING, // Field to store the product image URL
      allowNull: true
    }
  }, {
    timestamps: true  // Add this if you want createdAt and updatedAt columns
  });

  // Product has many sells
  Product.associate = (models) => {
    Product.hasMany(models.Sell, { foreignKey: 'product_id' });  // Ensure foreign key matches
  };

  return Product;
};
