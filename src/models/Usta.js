const mongoose = require("mongoose");

const ustaSxema = new mongoose.Schema(
  {
    ism: {
      type: String,
      required: true,
      default: "Jasur Aliyev",
    },
    lavozim: {
      type: String,
      required: true,
      default: "Bosh sartarosh",
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    login: {
      type: String,
      required: true,
      unique: true,
    },
    parolHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Usta = mongoose.model("Usta", ustaSxema);

module.exports = Usta;