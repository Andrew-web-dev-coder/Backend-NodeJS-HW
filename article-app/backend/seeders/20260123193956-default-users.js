"use strict";

import bcrypt from "bcrypt";

export default {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    const now = new Date();

    await queryInterface.bulkInsert("users", [
      {
        id: 1, 
        email: "admin@example.com",
        password: passwordHash,
        role: "admin",
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
