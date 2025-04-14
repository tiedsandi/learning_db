'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.Biodata, {
        foreignKey: 'user_id',
        as: 'biodata'
      })
      this.hasMany(models.Product, {
        foreignKey: 'seller_id',
        as: 'products'
      })
      this.hasMany(models.Transaction, {
        foreignKey: 'seller_id',
        as: 'transaction_sellers'
      })
      this.hasMany(models.Transaction, {
        foreignKey: 'buyer_id',
        as: 'transaction_buyers'
      })
      this.hasMany(models.Notification, {
        foreignKey: 'user_id',
        as: 'notifications'
      })
      this.hasMany(models.Wishlist, {
        foreignKey: 'user_id',
        as: 'wishlist'
      })
    }
  }
  User.init({
    uuid: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    oauth2: DataTypes.STRING,
    otp: DataTypes.STRING,
    token: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });
  return User;
};