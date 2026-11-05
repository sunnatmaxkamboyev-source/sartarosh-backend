const express = require("express");
const cors = require("cors");
const bandlovRoutes = require("./routes/bandlovRoutes");
const authRoutes = require("./routes/authRoutes");
const ustaRoutes = require("./routes/ustaRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.get("/api/health", (req, res) => {
  res.json({ holat: "ishlayapti" });
});

app.use("/api/bandlovlar", bandlovRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/usta", ustaRoutes);

module.exports = app;