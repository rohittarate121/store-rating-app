const { sequelize, User, Store, Rating } = require("./models/index");

async function test() {
  try {
    await sequelize.sync({ force: false });
    console.log("All models synced with relationships");
  } catch (error) {
    console.error("Failed:", error.message);
  }
}

test();
