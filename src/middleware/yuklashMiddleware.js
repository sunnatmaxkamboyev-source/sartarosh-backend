const multer = require("multer");
const path = require("path");
const fs = require("fs");

const YUKLASH_PAPKASI = "uploads";


if (!fs.existsSync(YUKLASH_PAPKASI)) {
  fs.mkdirSync(YUKLASH_PAPKASI, { recursive: true });
}

const saqlash = multer.diskStorage({
  destination: (req, fayl, cb) => {
    cb(null, YUKLASH_PAPKASI);
  },
  filename: (req, fayl, cb) => {
    const kengaytma = path.extname(fayl.originalname);
    const nom = `usta-${Date.now()}${kengaytma}`;
    cb(null, nom);
  },
});

function faylFiltri(req, fayl, cb) {
  if (fayl.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Faqat rasm fayllari qabul qilinadi"));
  }
}

const rasmYuklash = multer({
  storage: saqlash,
  fileFilter: faylFiltri,
  limits: { fileSize: 2 * 1024 * 1024 }, 
});

module.exports = { rasmYuklash };