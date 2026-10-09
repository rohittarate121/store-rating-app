const bcrypt = require("bcrypt");
const { sequelize, User } = require("./models/index");
require("dotenv").config();

async function seed() {
  try {
    await sequelize.sync({ force: false });

    const existing = await User.findOne({
      where: { email: "admin@admin.com" },
    });
    if (existing) {
      console.log("Admin account already exists, skipping seed");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@1234", 10);

    await User.create({
      name: "System Administrator",
      email: "admin@admin.com",
      password: hashedPassword,
      address: "Admin Office",
      role: "admin",
    });

    console.log("Admin account created successfully");
    console.log("Email: admin@admin.com");
    console.log("Password: Admin@1234");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
}

seed();
