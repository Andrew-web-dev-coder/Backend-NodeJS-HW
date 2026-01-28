"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("articles", "userId", {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "RESTRICT",
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("articles", "userId");
}
