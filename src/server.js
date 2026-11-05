require("dotenv").config();

const app = require("./app");
const { bazagaUlanish } = require("./config/db");

const PORT = process.env.PORT || 5000;

async function serverniIshgaTushirish() {
  await bazagaUlanish();

  app.listen(PORT, () => {
    console.log(`Server http://localhost:${PORT} manzilida ishga tushdi`);
  });
}

serverniIshgaTushirish();