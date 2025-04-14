'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {        
          model: 'products',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      bid_price: {
        type: Sequelize.DOUBLE
      },
      bid_status: {
        type: Sequelize.INTEGER
      },
      transaction_status: {
        type: Sequelize.INTEGER
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
      buyer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {        
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      bid_status_at: {
        type: Sequelize.DATE
      },
      transaction_status_at: {
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
    await queryInterface.dropTable('transactions');
  }
};