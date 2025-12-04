"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("articles", [
      {
        title: "BMW M3 E46",
        content:
          "The BMW M3 E46 is a legendary sports car from the early 2000s, powered by the naturally aspirated S54 engine paired with a manual gearbox.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        title: "Toyota Supra A80",
        content:
          "The Toyota Supra A80 is an iconic Japanese sports car from the 1990s, famous for its 2JZ-GTE turbocharged engine and incredible tuning potential.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        title: "Audi RS6 Avant",
        content:
          "The Audi RS6 Avant is a high-performance station wagon combining luxury and practicality with a powerful twin-turbo V8 engine and quattro all-wheel drive.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("articles", null, {});
  },
};
