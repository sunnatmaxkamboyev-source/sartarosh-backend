const Bandlov = require("../models/Bandlov");
const { xabarYuborish } = require("../bot/telegramBot");

// Mijoz uchun — yangi band qilish yaratish
async function bandlovYaratish(req, res) {
  try {
    const { sana, vaqt, ism, telefon, joy, xizmatlar, izoh } = req.body;

    if (!sana || !vaqt || !ism || !telefon) {
      return res.status(400).json({
        xabar: "Sana, vaqt, ism va telefon raqami to'ldirilishi shart",
      });
    }

    // Shu sana+vaqt allaqachon band qilinganmi, tekshiramiz
    const mavjud = await Bandlov.findOne({
      sana: new Date(sana),
      vaqt,
      holat: { $ne: "bekor_qilingan" },
    });

    if (mavjud) {
      return res.status(409).json({
        xabar: "Bu vaqt allaqachon band qilingan, boshqa vaqtni tanlang",
      });
    }

    const yangiBandlov = await Bandlov.create({
      sana: new Date(sana),
      vaqt,
      ism,
      telefon,
      joy: joy || "salon",
      xizmatlar: xizmatlar || [],
      izoh: izoh || "",
    });

    res.status(201).json(yangiBandlov);

    // Mijozga javob yuborilgandan KEYIN, sartaroshga Telegram xabarini jo'natamiz
    bildirishnomaniYuborish(yangiBandlov);
  } catch (xato) {
    console.error("Bandlov yaratishda xato:", xato);
    res.status(500).json({ xabar: "Serverda xatolik yuz berdi" });
  }
}

// Sartaroshga yangi bandlov haqida Telegram orqali xabar yuborish
function bildirishnomaniYuborish(bandlov) {
  const adminChatId = process.env.ADMIN_CHAT_ID;
  if (!adminChatId) return; // sozlanmagan bo'lsa, shunchaki o'tkazib yuboramiz

  const sanaMatni = new Date(bandlov.sana).toLocaleDateString("uz-UZ", {
    day: "numeric",
    month: "long",
  });

  const xizmatlarMatni = bandlov.xizmatlar.length
    ? bandlov.xizmatlar.join(", ")
    : "ko'rsatilmagan";

  const matn =
    "🆕 Yangi band qilish!\n\n" +
    `👤 Ism: ${bandlov.ism}\n` +
    `📞 Telefon: ${bandlov.telefon}\n` +
    `📅 Sana: ${sanaMatni}\n` +
    `🕐 Vaqt: ${bandlov.vaqt}\n` +
    `✂️ Xizmat: ${xizmatlarMatni}` +
    (bandlov.izoh ? `\n💬 Izoh: ${bandlov.izoh}` : "");

  xabarYuborish(adminChatId, matn);
}

// Mijoz uchun — berilgan sanada qaysi vaqtlar band ekanini ko'rsatish
async function bandVaqtlarniOlish(req, res) {
  try {
    const { sana } = req.query;

    if (!sana) {
      return res.status(400).json({ xabar: "Sana ko'rsatilishi kerak" });
    }

    const kunBoshi = new Date(sana);
    kunBoshi.setHours(0, 0, 0, 0);
    const kunOxiri = new Date(sana);
    kunOxiri.setHours(23, 59, 59, 999);

    const bandlovlar = await Bandlov.find({
      sana: { $gte: kunBoshi, $lte: kunOxiri },
      holat: { $ne: "bekor_qilingan" },
    }).select("vaqt");

    const bandVaqtlar = bandlovlar.map((b) => b.vaqt);
    res.json({ bandVaqtlar });
  } catch (xato) {
    console.error("Band vaqtlarni olishda xato:", xato);
    res.status(500).json({ xabar: "Serverda xatolik yuz berdi" });
  }
}

// Sartarosh uchun — barcha bandlovlar ro'yxati (himoyalangan)
async function bandlovlarRoyxati(req, res) {
  try {
    const bandlovlar = await Bandlov.find().sort({ sana: 1, vaqt: 1 });
    res.json(bandlovlar);
  } catch (xato) {
    console.error("Bandlovlar ro'yxatini olishda xato:", xato);
    res.status(500).json({ xabar: "Serverda xatolik yuz berdi" });
  }
}

// Sartarosh uchun — bandlov holatini o'zgartirish (tasdiqlash/bekor qilish)
async function bandlovHolatiniOzgartirish(req, res) {
  try {
    const { id } = req.params;
    const { holat } = req.body;

    const togriHolatlar = ["kutilmoqda", "tasdiqlangan", "bekor_qilingan"];
    if (!togriHolatlar.includes(holat)) {
      return res.status(400).json({ xabar: "Holat noto'g'ri" });
    }

    const bandlov = await Bandlov.findByIdAndUpdate(
      id,
      { holat },
      { new: true }
    );

    if (!bandlov) {
      return res.status(404).json({ xabar: "Bandlov topilmadi" });
    }

    res.json(bandlov);
  } catch (xato) {
    console.error("Holatni o'zgartirishda xato:", xato);
    res.status(500).json({ xabar: "Serverda xatolik yuz berdi" });
  }
}

// Sartarosh uchun — bandlovni butunlay o'chirish
async function bandlovniOchirish(req, res) {
  try {
    const { id } = req.params;
    const ochirilgan = await Bandlov.findByIdAndDelete(id);

    if (!ochirilgan) {
      return res.status(404).json({ xabar: "Bandlov topilmadi" });
    }

    res.json({ xabar: "Bandlov o'chirildi" });
  } catch (xato) {
    console.error("O'chirishda xato:", xato);
    res.status(500).json({ xabar: "Serverda xatolik yuz berdi" });
  }
}

module.exports = {
  bandlovYaratish,
  bandVaqtlarniOlish,
  bandlovlarRoyxati,
  bandlovHolatiniOzgartirish,
  bandlovniOchirish,
};