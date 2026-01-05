"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    
    await queryInterface.bulkDelete("article_versions", null, {});
    await queryInterface.bulkDelete("articles", null, {});

   
    await queryInterface.bulkInsert("articles", [
      { workspaceId: null, userId: 1, createdAt: now, updatedAt: now },
      { workspaceId: null, userId: 1, createdAt: now, updatedAt: now },
      { workspaceId: null, userId: 1, createdAt: now, updatedAt: now },
    ]);

    
    const articles = await queryInterface.sequelize.query(
      `SELECT id FROM articles ORDER BY "createdAt" ASC`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    
    await queryInterface.bulkInsert("article_versions", [
      {
        articleId: articles[0].id,
        version: 1,
        title: "BMW M3 E46",
        content:
          "The BMW M3 E46 is a legendary sports car from the early 2000s, powered by the naturally aspirated S54 engine paired with a manual gearbox.",
        attachments: JSON.stringify([]),
        createdAt: now,
      },
      {
        articleId: articles[1].id,
        version: 1,
        title: "Toyota Supra A80",
        content:
          "The Toyota Supra A80 is an iconic Japanese sports car from the 1990s, famous for its 2JZ-GTE engine and tuning potential.",
        attachments: JSON.stringify([]),
        createdAt: now,
      },
      {
        articleId: articles[2].id,
        version: 1,
        title: "Audi RS6 Avant",
        content:
          "The Audi RS6 Avant is a high-performance station wagon combining luxury, practicality, and a twin-turbo V8 engine.",
        attachments: JSON.stringify([]),
        createdAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("article_versions", null, {});
    await queryInterface.bulkDelete("articles", null, {});
  },
};
