'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DOUBLE
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {        
          model: 'categories',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      description: {
        type: Sequelize.TEXT
      },
      seller_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {        
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      status: Sequelize.INTEGER,
      bid_at: {
        type: Sequelize.DATE
      },
      sold_at: {
        type: Sequelize.DATE
      },
      createdBy: {
        type: Sequelize.INTEGER
      },
      updatedBy: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};