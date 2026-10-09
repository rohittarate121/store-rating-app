const { Rating, User, Store } = require("../models/index");

// GET /api/owner/dashboard
async function getDashboard(req, res) {
  try {
    const store = await Store.findOne({
      where: { ownerId: req.user.id },
    });

    if (!store) {
      return res.status(404).json({ message: "No store found for this owner" });
    }

    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const averageRating =
      ratings.length > 0
        ? parseFloat(
            (
              ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            ).toFixed(2),
          )
        : null;

    res.json({
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
      },
      averageRating,
      totalRatings: ratings.length,
      ratings: ratings.map((r) => ({
        id: r.id,
        rating: r.rating,
        user: r.user,
        submittedAt: r.createdAt,
      })),
    });
  } catch (error) {
    console.error("getDashboard error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
}

module.exports = { getDashboard };
