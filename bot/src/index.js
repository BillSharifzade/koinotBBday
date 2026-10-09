import { DurableObject } from 'cloudflare:workers';

const MAX_NAME = 60;
const MIN_TEXT = 2;
const MAX_TEXT = 1000;
const COOLDOWN_MS = 30_000; // one congratulation per sender every 30 s
const BATCH = 25; // messages per delivery tick; Telegram allows about 30 per second
const MAX_ATTEMPTS = 5;

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const hub = env.HUB.get(env.HUB.idFromName('main'));

    if (pathname === '/telegram' && request.method === 'POST') {
      if (request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== env.WEBHOOK_SECRET) {
        return new Response('Forbidden', { status: 403 });
      }
      try {
        await hub.handleUpdate(await request.json());
      } catch (err) {
        // Still answer 200, otherwise Telegram resends the same update over and over.
        console.error('update failed', err);
      }
      return new Response('ok');
    }

    if (pathname === '/congrats') return congratsFromSite(request, env, hub);
    if (pathname === '/stats') {
      if (request.headers.get('Authorization') !== `Bearer ${env.WEBHOOK_SECRET}`) {
        return new Response('Forbidden', { status: 403 });
      }
      return Response.json(await hub.stats());
    }
    if (pathname === '/') return new Response(`@${env.BOT_USERNAME} is running`);
    return new Response('Not found', { status: 404 });
  }
};

async function congratsFromSite(request, env, hub) {
  const origin = request.headers.get('Origin');
  const allowed = env.ALLOWED_ORIGINS.split(',').includes(origin);
  const headers = { Vary: 'Origin' };
  if (allowed) {
    Object.assign(headers, {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    });
  }
  const reply = (status, body) => Response.json(body, { status, headers });

  if (request.method === 'OPTIONS') return new Response(null, { status: allowed ? 204 : 403, headers });
  if (request.method !== 'POST') return reply(405, { error: 'method' });
  if (!allowed) return reply(403, { error: 'origin' });

  let body;
  try {
    body = await request.json();
  } catch {
    return reply(400, { error: 'invalid' });
  }
  // Honeypot: people never see this field, form-filling bots fill it in.
  if (body.website) return reply(200, { ok: true, recipients: 0 });

  const name = cleanName(body.name);
  const text = cleanText(body.text);
  if (!name || name.length > MAX_NAME) return reply(400, { error: 'name' });
  if (text.length < MIN_TEXT || text.length > MAX_TEXT) return reply(400, { error: 'text' });

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const result = await hub.addCongrats({ name, text, source: 'site', sender: `ip:${ip}` });
  if (!result.ok) return reply(429, { error: 'cooldown', retryAfter: result.retryAfter });
  return reply(200, { ok: true, recipients: result.recipients });
}

// One instance keeps the subscribers and delivers every congratulation to all of them.
export class Hub extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec(`
      CREATE TABLE IF NOT EXISTS subscribers (chat_id INTEGER PRIMARY KEY, name TEXT, joined_at INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS congrats (
        id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, text TEXT NOT NULL,
        source TEXT NOT NULL, created_at INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS outbox (
        congrat_id INTEGER NOT NULL, chat_id INTEGER NOT NULL, attempts INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (congrat_id, chat_id)
      );
      CREATE TABLE IF NOT EXISTS senders (key TEXT PRIMARY KEY, last_at INTEGER NOT NULL);
    `);
  }

  async addCongrats({ name, text, source, sender, skipChat = null }) {
    const now = Date.now();
    this.sql.exec('DELETE FROM senders WHERE last_at <= ?', now - COOLDOWN_MS);
    const [recent] = this.sql.exec('SELECT last_at FROM senders WHERE key = ?', sender).toArray();
    if (recent) return { ok: false, retryAfter: Math.ceil((recent.last_at + COOLDOWN_MS - now) / 1000) };
    this.sql.exec('INSERT INTO senders (key, last_at) VALUES (?, ?)', sender, now);

    const { id } = this.sql
      .exec('INSERT INTO congrats (name, text, source, created_at) VALUES (?, ?, ?, ?) RETURNING id', name, text, source, now)
      .one();
    this.sql.exec(
      'INSERT INTO outbox (congrat_id, chat_id) SELECT ?, chat_id FROM subscribers WHERE chat_id IS NOT ?',
      id,
      skipChat
    );
    const { recipients } = this.sql.exec('SELECT COUNT(*) AS recipients FROM outbox WHERE congrat_id = ?', id).one();
    if (recipients && (await this.ctx.storage.getAlarm()) === null) await this.ctx.storage.setAlarm(now);
    console.log(`congrats #${id} from ${source} queued for ${recipients}`);
    return { ok: true, recipients };
  }

  async handleUpdate(update) {
    const msg = update.message;
    if (msg?.chat?.type !== 'private') return; // the bot is for people, not groups or channels

    const chatId = msg.chat.id;
    const command = /^\/([a-z_]+)(?:@\w+)?(?:\s|$)/i.exec(msg.text ?? '')?.[1].toLowerCase();
    if (command === 'start') {
      this.sql.exec(
        'INSERT INTO subscribers (chat_id, name, joined_at) VALUES (?, ?, ?) ON CONFLICT (chat_id) DO NOTHING',
        chatId,
        personName(msg.from),
        Date.now()
      );
      return this.send(chatId, welcomeText(this.env));
    }
    if (command === 'stop') {
      this.forget(chatId);
      return this.send(chatId, 'Вы отписались от поздравлений. Чтобы снова их получать — /start');
    }
    if (command) return this.send(chatId, helpText(this.env));
    if (!msg.text) return this.send(chatId, 'Пока я принимаю только текст — напишите поздравление словами 🙂');

    const text = cleanText(msg.text);
    if (text.length < MIN_TEXT) return this.send(chatId, 'Напишите чуть больше 🙂');
    if (text.length > MAX_TEXT) {
      return this.send(chatId, `Получилось длинновато — уместите поздравление в ${MAX_TEXT} символов.`);
    }
    const result = await this.addCongrats({
      name: personName(msg.from),
      text,
      source: 'telegram',
      sender: `tg:${msg.from.id}`,
      skipChat: chatId
    });
    if (!result.ok) {
      return this.send(chatId, `Вы только что отправили поздравление. Следующее можно через ${result.retryAfter} с.`);
    }
    const n = result.recipients;
    return this.send(
      chatId,
      n
        ? `Спасибо! 🎉 Ваше поздравление получат ${n} ${plural(n, 'подписчик', 'подписчика', 'подписчиков')}.`
        : 'Спасибо! 🎉 Поздравление принято. Пока, кроме вас, у бота нет подписчиков.'
    );
  }

  // Delivers the outbox in small batches so Telegram's rate limits are respected.
  async alarm() {
    const batch = this.sql
      .exec(
        `SELECT o.congrat_id, o.chat_id, o.attempts, c.name, c.text
         FROM outbox o JOIN congrats c ON c.id = o.congrat_id
         ORDER BY o.congrat_id, o.chat_id LIMIT ?`,
        BATCH
      )
      .toArray();
    const results = await Promise.all(batch.map(row => this.send(row.chat_id, congratsMessage(row))));

    let pause = 1000;
    batch.forEach((row, i) => {
      const res = results[i];
      const key = [row.congrat_id, row.chat_id];
      if (res.ok) {
        this.sql.exec('DELETE FROM outbox WHERE congrat_id = ? AND chat_id = ?', ...key);
      } else if (res.error_code === 429) {
        pause = Math.max(pause, (res.parameters?.retry_after ?? 5) * 1000);
      } else if (res.error_code === 403 || /chat not found/i.test(res.description)) {
        this.forget(row.chat_id); // blocked the bot or deleted the account
      } else {
        console.warn(`send to ${row.chat_id} failed: ${res.error_code} ${res.description}`);
        if (row.attempts + 1 >= MAX_ATTEMPTS) this.sql.exec('DELETE FROM outbox WHERE congrat_id = ? AND chat_id = ?', ...key);
        else this.sql.exec('UPDATE outbox SET attempts = attempts + 1 WHERE congrat_id = ? AND chat_id = ?', ...key);
      }
    });

    const { left } = this.sql.exec('SELECT COUNT(*) AS left FROM outbox').one();
    if (left) await this.ctx.storage.setAlarm(Date.now() + pause);
  }

  stats() {
    const count = table => this.sql.exec(`SELECT COUNT(*) AS n FROM ${table}`).one().n;
    return { subscribers: count('subscribers'), congrats: count('congrats'), queued: count('outbox') };
  }

  forget(chatId) {
    this.sql.exec('DELETE FROM subscribers WHERE chat_id = ?', chatId);
    this.sql.exec('DELETE FROM outbox WHERE chat_id = ?', chatId);
  }

  send(chatId, text) {
    return telegram(this.env, 'sendMessage', {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      link_preview_options: { is_disabled: true }
    });
  }
}

async function telegram(env, method, payload) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    return { ok: false, error_code: 0, description: String(err) };
  }
}

function welcomeText(env) {
  return [
    '🎉 <b>КОИНОТИ НАВ — 35 лет!</b>',
    '',
    'Готово: теперь сюда будут приходить все новые поздравления — с сайта и из этого бота.',
    '',
    `✍️ Чтобы поздравить самому, просто напишите сообщение в этот чат — его получат все подписчики. Или оставьте поздравление на сайте: ${env.SITE_URL}`,
    '',
    '/stop — отписаться'
  ].join('\n');
}

function helpText(env) {
  return [
    'Напишите поздравление одним сообщением — его получат все подписчики бота.',
    `Поздравить можно и на сайте: ${env.SITE_URL}`,
    '',
    '/start — получать поздравления',
    '/stop — отписаться'
  ].join('\n');
}

function congratsMessage({ name, text }) {
  return `🎂 Поздравление от <b>${escapeHtml(name)}</b>\n\n${escapeHtml(text)}`;
}

function personName(user) {
  const name = cleanName([user?.first_name, user?.last_name].filter(Boolean).join(' '));
  return name || (user?.username ? `@${user.username}` : 'Гость');
}

function cleanName(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function cleanText(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/\r\n?/g, '\n')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function escapeHtml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function plural(n, one, few, many) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
