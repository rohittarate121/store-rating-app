const { Op } = require("sequelize");
const { Store, Rating } = require("../models/index");

// GET /api/stores
async function getStores(req, res) {
  try {
    const { name, address, sortBy = "name", order = "ASC" } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const validSortFields = ["name", "address", "createdAt"];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "name";
    const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const stores = await Store.findAll({
      where,
      attributes: ["id", "name", "address", "email"],
      include: [{ model: Rating, attributes: ["id", "rating", "userId"] }],
      order: [[sortField, sortOrder]],
    });

    const result = stores.map((store) => {
      const ratings = store.Ratings;

      const avg =
        ratings.length > 0
          ? parseFloat(
              (
                ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
              ).toFixed(2),
            )
          : null;

      const userRating = ratings.find((r) => r.userId === req.user.id);

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        email: store.email,
        averageRating: avg,
        myRating: userRating ? userRating.rating : null,
        myRatingId: userRating ? userRating.id : null,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("getStores error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
}

module.exports = { getStores };
