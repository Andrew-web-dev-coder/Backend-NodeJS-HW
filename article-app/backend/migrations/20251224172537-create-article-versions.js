"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("article_versions", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      articleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "articles",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      version: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      attachments: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addConstraint("article_versions", {
      fields: ["articleId", "version"],
      type: "unique",
      name: "unique_article_version",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("article_versions");
  },
};
