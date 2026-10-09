// Public address of the Telegram bot Worker (see bot/). Not a secret; the bot token stays in the Worker.
// For local testing run the Worker with `npm run dev` in bot/ and start Vite with VITE_BOT_API=http://localhost:8787.
export const BOT_API = import.meta.env.VITE_BOT_API ?? 'https://kn-anniversary-bot.sharifzadebilal.workers.dev';
export const BOT_USERNAME = 'kn_anniversary_bot';
export const BOT_URL = `https://t.me/${BOT_USERNAME}`;

export const MAX_NAME = 60;
export const MAX_TEXT = 1000;

// Resolves to { ok: true, recipients } or { ok: false, error, retryAfter? }.
export async function sendCongrats(fields) {
  try {
    const res = await fetch(`${BOT_API}/congrats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields)
    });
    const body = await res.json();
    return res.ok ? body : { ...body, ok: false };
  } catch {
    return { ok: false, error: 'network' };
  }
}
