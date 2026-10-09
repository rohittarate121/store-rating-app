const sequelize = require("../config/db");
const User = require("./User");
const Store = require("./Store");
const Rating = require("./Rating");

Store.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

Rating.belongsTo(User, { foreignKey: "userId", as: "user" });
Rating.belongsTo(Store, { foreignKey: "storeId", as: "store" });

User.hasMany(Rating, { foreignKey: "userId" });
Store.hasMany(Rating, { foreignKey: "storeId" });

module.exports = { sequelize, User, Store, Rating };
