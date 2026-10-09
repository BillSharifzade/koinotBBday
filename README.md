# КОИНОТИ НАВ — 35 лет

Сайт: https://billsharifzade.github.io/koinotBBday/

Праздничная страница к 35-летию Группы компаний «КОИНОТИ НАВ» (1991 — 2026).
Фирменные цвета, шрифт DIN Pro и логотип взяты с [koinotinav.tj](https://koinotinav.tj/).

- Фон с шарами — [`<Ballpit />`](src/components/Ballpit/Ballpit.jsx) (React Bits, three.js)
- Электрический логотип, который превращается в «35» — [`<ElectricLogo />`](src/components/ElectricLogo/ElectricLogo.jsx) (React Bits, ogl)
- Девиз «Верим. Можем. Создаём.», цифры и ценности
- 35 свечей, которые гаснут, если подуть в микрофон ([`useBlowDetector`](src/lib/useBlowDetector.js)).
  Звук анализируется только в браузере и никуда не записывается; без микрофона — нажмите на торт.
- Форма поздравлений ([`<Congrats />`](src/sections/Congrats.jsx)): каждое поздравление сразу приходит
  всем, кто нажал «Старт» в Telegram-боте [@kn_anniversary_bot](https://t.me/kn_anniversary_bot).

## Запуск

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # сборка в dist/
```

## Публикация

Каждый push в `main` собирает сайт и публикует `dist/` в ветку `gh-pages`
(`.github/workflows/deploy.yml`). В настройках репозитория: **Settings → Pages →
Source: Deploy from a branch → `gh-pages` / root**.

## Telegram-бот

GitHub Pages отдаёт только статические файлы, поэтому бот живёт в бесплатном
Cloudflare Worker ([`bot/`](bot/src/index.js)). Токен бота хранится только там, в коде и в репозитории его нет.

- `/start` подписывает на поздравления, `/stop` отписывает.
- Любое текстовое сообщение боту — тоже поздравление: его получат все остальные подписчики.
- Сайт отправляет поздравления на `POST /congrats` Worker'а (принимает запросы только с сайта и localhost,
  не чаще одного раза в 30 секунд с одного адреса).
- Подписчики и очередь рассылки — в Durable Object с SQLite; рассылка идёт пачками, чтобы не упереться в лимиты Telegram.

Изменения в `bot/` выкатываются сами (`.github/workflows/deploy-bot.yml`), если в репозитории есть секрет
`CLOUDFLARE_API_TOKEN` (Cloudflare → My Profile → API Tokens → шаблон «Edit Cloudflare Workers»).

Первая настройка (один раз):

```bash
cd bot
npm install
npx wrangler login
npx wrangler deploy
npx wrangler secret put BOT_TOKEN        # токен от @BotFather
npx wrangler secret put WEBHOOK_SECRET   # любая длинная случайная строка
curl "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
  -d url=https://kn-anniversary-bot.sharifzadebilal.workers.dev/telegram \
  -d secret_token=<WEBHOOK_SECRET> -d 'allowed_updates=["message"]'
```

Локально: положите `BOT_TOKEN` и `WEBHOOK_SECRET` в `bot/.dev.vars`, запустите `npm run dev` в `bot/`
и сайт с `VITE_BOT_API=http://localhost:8787 npm run dev`.
