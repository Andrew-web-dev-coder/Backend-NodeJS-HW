"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("users", "role", {
    type: Sequelize.ENUM("admin", "user"),
    allowNull: false,
    defaultValue: "user",
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("users", "role");
  await queryInterface.sequelize.query(
    'DROP TYPE IF EXISTS "enum_users_role";'
  );
}
