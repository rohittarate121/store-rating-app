const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { User, Store, Rating } = require("../models/index");
const {
  validateName,
  validatePassword,
  validateEmail,
} = require("../utils/validate");

// GET /api/admin/stats
async function getStats(req, res) {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// GET /api/admin/users
async function getUsers(req, res) {
  try {
    const {
      name,
      email,
      address,
      role,
      sortBy = "name",
      order = "ASC",
    } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    if (role) where.role = role;

    const validSortFields = ["name", "email", "role", "createdAt"];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "name";
    const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const users = await User.findAll({
      where,
      attributes: ["id", "name", "email", "address", "role", "createdAt"],
      order: [[sortField, sortOrder]],
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// GET /api/admin/users/:id
async function getUserDetail(req, res) {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "name", "email", "address", "role"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If the user is a store owner, find their store and average rating
    let storeRating = null;
    if (user.role === "owner") {
      const store = await Store.findOne({
        where: { ownerId: user.id },
        include: [
          {
            model: Rating,
            attributes: ["rating"],
          },
        ],
      });

      if (store) {
        const ratings = store.Ratings;
        if (ratings.length > 0) {
          const avg =
            ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
          storeRating = parseFloat(avg.toFixed(2));
        } else {
          storeRating = null;
        }
      }
    }

    res.json({ ...user.toJSON(), storeRating });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// POST /api/admin/users
async function createUser(req, res) {
  try {
    const { name, email, password, address, role } = req.body;

    if (!validateName(name)) {
      return res
        .status(400)
        .json({ message: "Name must be between 20 and 60 characters" });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must be 8-16 characters with at least one uppercase letter and one special character",
      });
    }
    if (address && address.length > 400) {
      return res
        .status(400)
        .json({ message: "Address must be under 400 characters" });
    }
    if (!["admin", "user", "owner"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Role must be admin, user or owner" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// GET /api/admin/stores
async function getStores(req, res) {
  try {
    const { name, email, address, sortBy = "name", order = "ASC" } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const validSortFields = ["name", "email", "createdAt"];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "name";
    const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const stores = await Store.findAll({
      where,
      attributes: ["id", "name", "email", "address", "ownerId"],
      include: [
        { model: Rating, attributes: ["rating"] },
        { model: User, as: "owner", attributes: ["id", "name", "email"] },
      ],
      order: [[sortField, sortOrder]],
    });

    // Calculate average rating for each store
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

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        owner: store.owner,
        averageRating: avg,
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// POST /api/admin/stores
async function createStore(req, res) {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!validateName(name)) {
      return res
        .status(400)
        .json({ message: "Name must be between 20 and 60 characters" });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (address && address.length > 400) {
      return res
        .status(400)
        .json({ message: "Address must be under 400 characters" });
    }

    const existingStore = await Store.findOne({ where: { email } });
    if (existingStore) {
      return res
        .status(400)
        .json({ message: "Store email already registered" });
    }

    // Validate that ownerId belongs to a user with owner role
    if (ownerId) {
      const owner = await User.findByPk(ownerId);
      if (!owner) {
        return res.status(400).json({ message: "Owner not found" });
      }
      if (owner.role !== "owner") {
        return res
          .status(400)
          .json({ message: "Selected user is not a store owner" });
      }
    }

    const store = await Store.create({
      name,
      email,
      address,
      ownerId: ownerId || null,
    });

    res.status(201).json({ message: "Store created successfully", store });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

module.exports = {
  getStats,
  getUsers,
  getUserDetail,
  createUser,
  getStores,
  createStore,
};
