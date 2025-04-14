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

     await queryInterface.bulkInsert('product_pictures', [
      {
        product_id: 1,
        picture: 'https://res.cloudinary.com/aribrilliantsyah/image/upload/v1658497545/product/i0zolyg0uc1a3v1dcbrz.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_id: 2,
        picture: 'https://res.cloudinary.com/aribrilliantsyah/image/upload/v1658497717/product/cfigeux8edpld03wqcnw.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_id: 1,
        picture: 'https://res.cloudinary.com/aribrilliantsyah/image/upload/v1658497545/product/i0zolyg0uc1a3v1dcbrz.jpg',
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

     await queryInterface.bulkDelete('product_pictures', [
      {
        product_id: 1
      },
      {
        product_id: 2
      }
    ])
  }
};
