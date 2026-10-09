const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const {
  getStats,
  getUsers,
  getUserDetail,
  createUser,
  getStores,
  createStore,
} = require("../controllers/adminController");

// All admin routes require a valid token and admin role
router.use(auth, authorize("admin"));

router.get("/stats", getStats);
router.get("/users", getUsers);
router.get("/users/:id", getUserDetail);
router.post("/users", createUser);
router.get("/stores", getStores);
router.post("/stores", createStore);

module.exports = router;
