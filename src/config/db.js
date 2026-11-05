const mongoose = require("mongoose");

async function bazagaUlanish() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("MONGODB_URI .env faylida topilmadi");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB'ga muvaffaqiyatli ulandi");
  } catch (xato) {
    console.error("MongoDB'ga ulanishda xato:", xato);
    process.exit(1);
  }
}

module.exports = { bazagaUlanish };