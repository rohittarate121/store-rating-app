const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Store = sequelize.define("Store", {
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: true,
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "ownerId",
    references: {
      model: "Users",
      key: "id",
    },
  },
});

module.exports = Store;
