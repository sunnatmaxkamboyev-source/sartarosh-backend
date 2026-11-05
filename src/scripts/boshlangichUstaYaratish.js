require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { bazagaUlanish } = require("../config/db");
const Usta = require("../models/Usta");

const login = process.argv[2];
const parol = process.argv[3];

async function ishgaTushirish() {
  console.log("Skript boshlandi...");

  if (!login || !parol) {
    console.log("Foydalanish: node src/scripts/boshlangichUstaYaratish.js <login> <parol>");
    return;
  }

  console.log("Bazaga ulanmoqda...");
  await bazagaUlanish();
  console.log("Bazaga ulandi, login tekshirilmoqda...");

  const mavjud = await Usta.findOne({ login });
  if (mavjud) {
    console.log("Bu login bilan usta allaqachon mavjud:", login);
    await mongoose.disconnect();
    return;
  }

  console.log("Parol shifrlanmoqda...");
  const parolHash = await bcrypt.hash(parol, 10);

  console.log("Usta bazaga yozilmoqda...");
  const yangiUsta = await Usta.create({
    ism: "Jasur Aliyev",
    lavozim: "Bosh sartarosh",
    avatarUrl: "",
    login,
    parolHash,
  });

  console.log("================================");
  console.log("Admin hisobi yaratildi!");
  console.log("Login:", yangiUsta.login);
  console.log("Parol:", parol);
  console.log("================================");

  await mongoose.disconnect();
}

ishgaTushirish()
  .then(() => {
    console.log("Skript tugadi.");
  })
  .catch((xato) => {
    console.error("XATO YUZ BERDI:", xato);
  });