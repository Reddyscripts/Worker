import { Telegraf } from "telegraf";

const BOT_TOKEN = process.env.BOT_TOKEN;
const SOURCE_CHAT_ID = Number(process.env.SOURCE_CHAT_ID);
const SOURCE_USER_ID = Number(process.env.SOURCE_USER_ID);
const TARGET_CHAT_ID = process.env.TARGET_CHAT_ID;

if (!BOT_TOKEN || !SOURCE_CHAT_ID || !SOURCE_USER_ID || !TARGET_CHAT_ID) {
  throw new Error(
    "Missing environment variables. Please set BOT_TOKEN, SOURCE_CHAT_ID, SOURCE_USER_ID, TARGET_CHAT_ID"
  );
}

const bot = new Telegraf(BOT_TOKEN);

bot.on("message", async (ctx) => {
  try {
    if (ctx.chat.id === SOURCE_CHAT_ID && ctx.from.id === SOURCE_USER_ID) {
      if (ctx.message.text) {
        await ctx.telegram.sendMessage(TARGET_CHAT_ID, ctx.message.text);
      } else if (ctx.message.caption) {
        await ctx.telegram.sendMessage(TARGET_CHAT_ID, ctx.message.caption);
      }
    }
  } catch (err) {
    console.error("Error sending message:", err);
  }
});

// Export handler for Vercel serverless function
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await bot.handleUpdate(req.body);
      res.status(200).send("OK");
    } catch (error) {
      console.error("Telegram webhook error:", error);
      res.status(500).send("Error");
    }
  } else {
    res.status(200).send("Telegram bot webhook endpoint");
  }
}
