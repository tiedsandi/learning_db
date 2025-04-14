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
   await queryInterface.bulkInsert('cities', [
      {
        'city': 'Jakarta',
        'createdBy': null,
        'updatedBy': null,
        'createdAt': new Date(),
        'updatedAt': new Date()
      },
      {
        'city': 'Bogor',
        'createdBy': null,
        'updatedBy': null,
        'createdAt': new Date(),
        'updatedAt': new Date()
      },
      {
        'city': 'Depok',
        'createdBy': null,
        'updatedBy': null,
        'createdAt': new Date(),
        'updatedAt': new Date()
      },
      {
        'city': 'Tangerang',
        'createdBy': null,
        'updatedBy': null,
        'createdAt': new Date(),
        'updatedAt': new Date()
      },
      {
        'city': 'Bekasi',
        'createdBy': null,
        'updatedBy': null,
        'createdAt': new Date(),
        'updatedAt': new Date()
      },
      {
        'city': 'Bandung',
        'createdBy': null,
        'updatedBy': null,
        'createdAt': new Date(),
        'updatedAt': new Date()
      },
      {
        'city': 'Medan',
        'createdBy': null,
        'updatedBy': null,
        'createdAt': new Date(),
        'updatedAt': new Date()
      },
      {
        'city': 'Makasar',
        'createdBy': null,
        'updatedBy': null,
        'createdAt': new Date(),
        'updatedAt': new Date()
      },
      {
        'city': 'Bali',
        'createdBy': null,
        'updatedBy': null,
        'createdAt': new Date(),
        'updatedAt': new Date()
      },
      {
        'city': 'Padang',
        'createdBy': null,
        'updatedBy': null,
        'createdAt': new Date(),
        'updatedAt': new Date()
      },
      {
        'city': 'Riau',
        'createdBy': null,
        'updatedBy': null,
        'createdAt': new Date(),
        'updatedAt': new Date()
      },
      {
        'city': 'Aceh',
        'createdBy': null,
        'updatedBy': null,
        'createdAt': new Date(),
        'updatedAt': new Date()
      },
      {
        'city': 'Banjarmasin',
        'createdBy': null,
        'updatedBy': null,
        'createdAt': new Date(),
        'updatedAt': new Date()
      },
      {
        'city': 'Palembang',
        'createdBy': null,
        'updatedBy': null,
        'createdAt': new Date(),
        'updatedAt': new Date()
      },
      {
        'city': 'Batam',
        'createdBy': null,
        'updatedBy': null,
        'createdAt': new Date(),
        'updatedAt': new Date()
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
     await queryInterface.bulkDelete('cities', [
      {
        'city': 'Jakarta',
      },
      {
        'city': 'Bogor',
      },
      {
        'city': 'Depok',
      },
      {
        'city': 'Tangerang',
      },
      {
        'city': 'Bekasi',
      },
      {
        'city': 'Bandung',
      },
      {
        'city': 'Medan',
      },
      {
        'city': 'Makasar',
      },
      {
        'city': 'Bali',
      },
      {
        'city': 'Padang',
      },
      {
        'city': 'Riau',
      },
      {
        'city': 'Aceh',
      },
      {
        'city': 'Banjarmasin',
      },
      {
        'city': 'Palembang',
      },
      {
        'city': 'Batam',
      },
     ]);
  }
};