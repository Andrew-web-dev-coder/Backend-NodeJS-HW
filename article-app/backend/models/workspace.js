export default (sequelize, DataTypes) => {
  const Workspace = sequelize.define(
    "Workspace",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "workspaces",
      timestamps: true,
    }
  );

  Workspace.associate = (models) => {
    Workspace.hasMany(models.Article, {
      foreignKey: "workspaceId",
      as: "articles",
    });
  };

  return Workspace;
};
