export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("articles", "userId", {
    type: Sequelize.INTEGER,
    allowNull: true, 
    references: {
      model: "users",
      key: "id",
    },
    onDelete: "CASCADE",
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("articles", "userId");
}
