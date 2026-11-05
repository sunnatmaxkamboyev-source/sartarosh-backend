const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usta = require("../models/Usta");

async function kirish(req, res) {
  try {
    const { login, parol } = req.body;

    if (!login || !parol) {
      return res.status(400).json({ xabar: "Login va parolni kiriting" });
    }

    const usta = await Usta.findOne({ login });
    if (!usta) {
      return res.status(401).json({ xabar: "Login yoki parol noto'g'ri" });
    }

    const parolTogri = await bcrypt.compare(parol, usta.parolHash);
    if (!parolTogri) {
      return res.status(401).json({ xabar: "Login yoki parol noto'g'ri" });
    }

    const token = jwt.sign(
      { ustaId: usta._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      usta: {
        ism: usta.ism,
        lavozim: usta.lavozim,
        avatarUrl: usta.avatarUrl,
      },
    });
  } catch (xato) {
    console.error("Kirishda xato:", xato);
    res.status(500).json({ xabar: "Serverda xatolik yuz berdi" });
  }
}

module.exports = { kirish };