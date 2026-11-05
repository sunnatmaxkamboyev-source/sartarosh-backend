const express = require("express");
const {
  bandlovYaratish,
  bandVaqtlarniOlish,
  bandlovlarRoyxati,
  bandlovHolatiniOzgartirish,
  bandlovniOchirish,
} = require("../controllers/bandlovController");
const { admingaRuxsat } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", bandlovYaratish);
router.get("/band-vaqtlar", bandVaqtlarniOlish);

router.get("/", admingaRuxsat, bandlovlarRoyxati);
router.patch("/:id", admingaRuxsat, bandlovHolatiniOzgartirish);
router.delete("/:id", admingaRuxsat, bandlovniOchirish);

module.exports = router;