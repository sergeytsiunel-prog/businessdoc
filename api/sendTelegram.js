export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const text = `
Новая заявка:
Имя: ${name}
Email: ${email}
Сообщение: ${message}
    `;

    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text
      })
    });

    const tgData = await tgRes.json();

    return res.status(200).json({ success: true, tgData });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
