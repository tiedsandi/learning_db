'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Biodata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      })
      this.belongsTo(models.City, {
        foreignKey: 'city_id',
        as: 'city'
      })
    }
  }
  Biodata.init({
    user_id: DataTypes.INTEGER,
    fullname: DataTypes.STRING,
    profile_picture: DataTypes.STRING,
    city_id: DataTypes.INTEGER,
    address: DataTypes.TEXT,
    number_phone: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Biodata',
    tableName: 'biodata'
  });
  return Biodata;
};