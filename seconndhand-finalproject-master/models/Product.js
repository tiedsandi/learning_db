'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category'
      })
      this.belongsTo(models.User, {
        foreignKey: 'seller_id',
        as: 'user'
      })
      this.hasMany(models.Wishlist, {
        foreignKey: 'product_id',
        as: 'wishlist'
      })
      this.hasMany(models.ProductPicture, {
        foreignKey: 'product_id',
        as: 'product_pictures'
      })
      this.hasMany(models.Transaction, {
        foreignKey: 'product_id',
        as: 'transactions'
      })
    }
  }

  //status: 0 = draf, 1 = published, 2 = bid, 3 = sold
  Product.init({
    product: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    category_id: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    seller_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
  });
  return Product;
};