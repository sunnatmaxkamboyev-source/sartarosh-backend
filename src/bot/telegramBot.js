const { Telegraf } = require("telegraf");

let bot = null;

function botniIshgaTushirish() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const webappUrl = process.env.WEBAPP_URL;

  if (!token) {
    console.log("TELEGRAM_BOT_TOKEN topilmadi — bot ishga tushmadi (ixtiyoriy)");
    return null;
  }

  bot = new Telegraf(token);

  bot.start((ctx) => {
    const chatId = ctx.chat.id;
    console.log(`Yangi foydalanuvchi /start bosdi. Chat ID: ${chatId}`);

    if (!webappUrl) {
      ctx.reply("Xush kelibsiz! (WEBAPP_URL hali sozlanmagan, admin tez orada to'ldiradi)");
      return;
    }

    ctx.reply("Xush kelibsiz! Sartaroshxonaga band qilish uchun tugmani bosing 👇", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📅 Band qilish", web_app: { url: webappUrl } }],
        ],
      },
    });
  });

  bot.command("id", (ctx) => {
    ctx.reply(`Sizning chat ID'ingiz: ${ctx.chat.id}`);
  });

  bot.launch();
  console.log("Telegram bot ishga tushdi");

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));

  return bot;
}

function xabarYuborish(chatId, matn) {
  if (!bot) {
    console.log("Bot ishga tushmagan, xabar yuborilmadi");
    return;
  }
  bot.telegram.sendMessage(chatId, matn).catch((xato) => {
    console.error("Telegram xabar yuborishda xato:", xato.message);
  });
}

module.exports = { botniIshgaTushirish, xabarYuborish };