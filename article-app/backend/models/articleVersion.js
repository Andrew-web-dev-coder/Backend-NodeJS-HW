"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ArticleVersion extends Model {
    static associate(models) {
      ArticleVersion.belongsTo(models.Article, {
        foreignKey: "articleId",
        as: "article",
        onDelete: "CASCADE",
      });
    }
  }

  ArticleVersion.init(
    {
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "articles",
          key: "id",
        },
      },

      version: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      attachments: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
    },
    {
      sequelize,
      modelName: "ArticleVersion",
      tableName: "article_versions",
      timestamps: true,
      updatedAt: false,
      indexes: [
        {
          unique: true,
          fields: ["articleId", "version"],
        },
      ],
    }
  );

  return ArticleVersion;
};
