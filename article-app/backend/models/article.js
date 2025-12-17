"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      
      Article.belongsTo(models.Workspace, {
        foreignKey: "workspaceId",
        as: "workspace",
        onDelete: "SET NULL"
      });

      
      Article.hasMany(models.Comment, {
        foreignKey: "articleId",
        as: "comments",
        onDelete: "CASCADE",
      });
    }
  }

  Article.init(
    {
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
      workspaceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: "Article",
      tableName: "articles",
      timestamps: true,
    }
  );

  return Article;
};
