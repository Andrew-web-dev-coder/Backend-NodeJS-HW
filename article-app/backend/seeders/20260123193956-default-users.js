"use strict";
import bcrypt from "bcrypt";

export default {
  async up(queryInterface) {
    const now = new Date();

    
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users LIMIT 1`
    );

    if (users[0].length > 0) {
      console.log("ℹ️ Users already exist, skipping default-users seed");
      return;
    }

    
    const passwordHash = await bcrypt.hash("admin123", 10);

   
    await queryInterface.bulkInsert("users", [
      {
        email: "admin@example.com",
        password: passwordHash,
        role: "admin",
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", {
      email: "admin@example.com",
    });
  },
};
