# КОИНОТИ НАВ — 35 лет

Праздничная страница к 35-летию Группы компаний «КОИНОТИ НАВ» (1991 — 2026).
Фирменные цвета, шрифт DIN Pro и логотипы взяты с [koinotinav.tj](https://koinotinav.tj/).

- Фон с шарами — [`<Ballpit />`](src/components/Ballpit/Ballpit.jsx) (React Bits, three.js)
- Электрический логотип, который превращается в «35» — [`<ElectricLogo />`](src/components/ElectricLogo/ElectricLogo.jsx) (React Bits, ogl)
- Девиз «Верим. Можем. Создаём.», цифры, история 1991 — 2026, компании группы, ценности и 35 свечей

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
