"use strict";

module.exports = {
  async up(queryInterface) {
    
    await queryInterface.bulkDelete("articles", null, {});

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
          "The Toyota Supra A80 is an iconic Japanese sports car from the 1990s, famous for its 2JZ-GTE engine and tuning potential.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Audi RS6 Avant",
        content:
          "The Audi RS6 Avant is a high-performance station wagon combining luxury, practicality, and a twin-turbo V8 engine.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("articles", null, {});
  },
};
