const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM("admin", "user", "owner"),
    defaultValue: "user",
  },
});

module.exports = User;
