const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const {
  submitRating,
  updateRating,
} = require("../controllers/ratingController");

router.post("/", auth, authorize("user"), submitRating);
router.patch("/:id", auth, authorize("user"), updateRating);

module.exports = router;
