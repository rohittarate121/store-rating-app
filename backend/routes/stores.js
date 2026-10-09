const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const { getStores } = require("../controllers/storeController");

router.get("/", auth, authorize("user"), getStores);

module.exports = router;
