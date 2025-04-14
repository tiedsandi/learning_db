'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      })
      this.belongsTo(models.User, {
        foreignKey: 'buyer_id',
        as: 'buyer'
      })
      this.belongsTo(models.User, {
        foreignKey: 'seller_id',
        as: 'seller'
      })
    }
  }
  Transaction.init({
    product_id: DataTypes.INTEGER,
    bid_price: DataTypes.DOUBLE,
    bid_status: DataTypes.INTEGER,
    transaction_status: DataTypes.INTEGER,
    seller_id: DataTypes.INTEGER,
    buyer_id: DataTypes.INTEGER,
    bid_status_at: DataTypes.DATE,
    transaction_status_at: DataTypes.DATE,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transactions',
  });
  return Transaction;
};