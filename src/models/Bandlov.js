const mongoose = require("mongoose");

const bandlovSxema = new mongoose.Schema(
  {
    sana: {
      type: Date,
      required: true,
    },
    vaqt: {
      type: String,
      required: true,
    },
    ism: {
      type: String,
      required: true,
    },
    telefon: {
      type: String,
      required: true,
    },
    joy: {
      type: String,
      enum: ["salon", "qongiroq", "boshqa"],
      default: "salon",
    },
    xizmatlar: {
      type: [String],
      default: [],
    },
    izoh: {
      type: String,
      default: "",
    },
    holat: {
      type: String,
      enum: ["kutilmoqda", "tasdiqlangan", "bekor_qilingan"],
      default: "kutilmoqda",
    },
  },
  { timestamps: true }
);

const Bandlov = mongoose.model("Bandlov", bandlovSxema);

module.exports = Bandlov;