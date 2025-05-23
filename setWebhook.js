export default async function handler(req, res) {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const WEBHOOK_URL = `https://${req.headers.host}`;

  if (!BOT_TOKEN) {
    return res.status(400).send("BOT_TOKEN not set in environment");
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`;
  const payload = {
    url: WEBHOOK_URL
  };

  try {
    const telegramRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await telegramRes.json();
    res.status(200).json({ message: "Webhook set", data });
  } catch (error) {
    console.error("Failed to set webhook:", error);
    res.status(500).json({ error: "Webhook failed", detail: error.message });
  }
}
