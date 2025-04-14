'use strict';

const { DATE } = require("sequelize");

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('categories', [
      {
        category: "Hobi",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category: "Kendaraan",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category: "Baju",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category: "Elektronik",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category: "Kesehatan",
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('categories', [
      {
        category: "Hobi",
      },
      {
        category: "Kendaraan",
      },
      {
        category: "Baju",
      },
      {
        category: "Elektronik",
      },
      {
        category: "Kesehatan",
      },
    ])
  }
};
