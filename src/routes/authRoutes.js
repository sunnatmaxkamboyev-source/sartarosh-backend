const express = require("express");
const { kirish } = require("../controllers/authController");

const router = express.Router();

router.post("/kirish", kirish);

module.exports = router;