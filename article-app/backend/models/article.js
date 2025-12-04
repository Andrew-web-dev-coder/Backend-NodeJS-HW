"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Article extends Model {}

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
