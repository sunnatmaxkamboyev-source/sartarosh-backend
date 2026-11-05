const Usta = require("../models/Usta");

// Ochiq — mijozlar uchun usta profilini ko'rsatish (parol qaytarilmaydi)
async function ustaProfiliniOlish(req, res) {
  try {
    const usta = await Usta.findOne().select("-parolHash");

    if (!usta) {
      return res.status(404).json({ xabar: "Usta topilmadi" });
    }

    res.json(usta);
  } catch (xato) {
    console.error("Usta profilini olishda xato:", xato);
    res.status(500).json({ xabar: "Serverda xatolik yuz berdi" });
  }
}

// Himoyalangan — sartarosh o'z ism/lavozimini yangilaydi
async function ustaProfiliniYangilash(req, res) {
  try {
    const { ism, lavozim } = req.body;

    const usta = await Usta.findByIdAndUpdate(
      req.ustaId,
      { ism, lavozim },
      { new: true }
    ).select("-parolHash");

    if (!usta) {
      return res.status(404).json({ xabar: "Usta topilmadi" });
    }

    res.json(usta);
  } catch (xato) {
    console.error("Profilni yangilashda xato:", xato);
    res.status(500).json({ xabar: "Serverda xatolik yuz berdi" });
  }
}

// Himoyalangan — rasm yuklash/almashtirish
async function ustaRasminiYangilash(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ xabar: "Rasm fayli topilmadi" });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    const usta = await Usta.findByIdAndUpdate(
      req.ustaId,
      { avatarUrl },
      { new: true }
    ).select("-parolHash");

    if (!usta) {
      return res.status(404).json({ xabar: "Usta topilmadi" });
    }

    res.json(usta);
  } catch (xato) {
    console.error("Rasmni yangilashda xato:", xato);
    res.status(500).json({ xabar: "Serverda xatolik yuz berdi" });
  }
}


async function ustaRasminiOchirish(req, res) {
  try {
    const usta = await Usta.findByIdAndUpdate(
      req.ustaId,
      { avatarUrl: "" },
      { new: true }
    ).select("-parolHash");

    if (!usta) {
      return res.status(404).json({ xabar: "Usta topilmadi" });
    }

    res.json(usta);
  } catch (xato) {
    console.error("Rasmni o'chirishda xato:", xato);
    res.status(500).json({ xabar: "Serverda xatolik yuz berdi" });
  }
}

module.exports = {
  ustaProfiliniOlish,
  ustaProfiliniYangilash,
  ustaRasminiYangilash,
  ustaRasminiOchirish,
};