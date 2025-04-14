'use strict';

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

    await queryInterface.bulkInsert('products', [
      {
        product: "Mini Figure Sagiri",
        price: 200000,
        category_id: 1,
        status: 1,
        description: "Dijual karena sudah tobat",
        seller_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product: "Kaos MU",
        price: 40000,
        category_id: 3,
        status: 1,
        description: "Dijual karena sudah pindah klub bola",
        seller_id: 2,
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

    await queryInterface.bulkDelete('products', [
      {
        product: 'Mini Figure Sagiri'
      },
      {
        product: 'Kaos MU'
      },
    ])
  }
};
