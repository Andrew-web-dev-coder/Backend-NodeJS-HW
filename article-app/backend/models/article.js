import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      Article.belongsTo(models.Workspace, {
        foreignKey: "workspaceId",
        as: "workspace",
        onDelete: "SET NULL",
      });

      Article.hasMany(models.Comment, {
        foreignKey: "articleId",
        as: "comments",
        onDelete: "CASCADE",
      });

      Article.hasMany(models.ArticleVersion, {
        foreignKey: "articleId",
        as: "versions",
        onDelete: "CASCADE",
      });
    }
  }

  Article.init(
    {
      workspaceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
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
