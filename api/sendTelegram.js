// ==============================================
// SERVERLESS: Отправка формы в Telegram
// ==============================================

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const telegramMessage = `
🎯 <b>НОВАЯ ЗАЯВКА с BusinessDoc.pro</b>

👤 <b>Имя:</b> ${name}
📧 <b>Email:</b> ${email}

💬 <b>Задача/проблема:</b>
${message}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
`;

  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: telegramMessage,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();

    if (data.ok) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ error: data.description });
    }

  } catch (err) {
    console.error('Ошибка Telegram API:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
