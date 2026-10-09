const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const { getDashboard } = require("../controllers/ownerController");

router.get("/dashboard", auth, authorize("owner"), getDashboard);

module.exports = router;
