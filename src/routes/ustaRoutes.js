const express = require("express");
const {
  ustaProfiliniOlish,
  ustaProfiliniYangilash,
  ustaRasminiYangilash,
  ustaRasminiOchirish,
} = require("../controllers/ustaController");
const { admingaRuxsat } = require("../middleware/authMiddleware");
const { rasmYuklash } = require("../middleware/yuklashMiddleware");

const router = express.Router();

// Ochiq
router.get("/", ustaProfiliniOlish);

// Himoyalangan
router.patch("/", admingaRuxsat, ustaProfiliniYangilash);
router.post("/rasm", admingaRuxsat, rasmYuklash.single("rasm"), ustaRasminiYangilash);
router.delete("/rasm", admingaRuxsat, ustaRasminiOchirish);

module.exports = router;