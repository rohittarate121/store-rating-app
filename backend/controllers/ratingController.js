const { Rating } = require("../models/index");

// POST /api/ratings
async function submitRating(req, res) {
  try {
    const { storeId, rating } = req.body;

    if (!storeId || !rating) {
      return res.status(400).json({ message: "Store and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Check if user already rated this store
    const existing = await Rating.findOne({
      where: { userId: req.user.id, storeId },
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "You have already rated this store" });
    }

    const newRating = await Rating.create({
      userId: req.user.id,
      storeId,
      rating,
    });

    res
      .status(201)
      .json({ message: "Rating submitted successfully", rating: newRating });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// PATCH /api/ratings/:id
async function updateRating(req, res) {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const existing = await Rating.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ message: "Rating not found" });
    }

    await existing.update({ rating });

    res.json({ message: "Rating updated successfully", rating: existing });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

module.exports = { submitRating, updateRating };
