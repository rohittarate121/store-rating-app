const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Rating = sequelize.define("Rating", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Stores",
      key: "id",
    },
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
});

module.exports = Rating;
