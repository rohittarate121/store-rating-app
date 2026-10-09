const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models/index");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const storeRoutes = require("./routes/stores");
const ratingRoutes = require("./routes/ratings");
const ownerRoutes = require("./routes/owner");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/owner", ownerRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Store Rating API is running" });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.sync({ force: false });
    console.log("Database synced");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
  }
}

startServer();
