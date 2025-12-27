"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("articles", "title");
    await queryInterface.removeColumn("articles", "content");
    await queryInterface.removeColumn("articles", "attachments");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("articles", "title", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("articles", "content", {
      type: Sequelize.TEXT,
      allowNull: false,
    });

    await queryInterface.addColumn("articles", "attachments", {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: [],
    });
  },
};
