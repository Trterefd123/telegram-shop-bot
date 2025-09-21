export default function handler(req, res) {
  if (req.method === 'POST') {
    // Обработка webhook от Telegram
    console.log('Webhook received:', req.body);
    res.status(200).json({ ok: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
