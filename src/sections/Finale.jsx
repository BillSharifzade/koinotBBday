import { useEffect, useRef, useState } from 'react';
import Reveal from '../lib/Reveal.jsx';
import { salute } from '../lib/celebrate.js';

const CANDLES = 35;
const STEP = 45; // ms between candles going out
const STRIPES = ['red', 'lavender', 'white'];

export default function Finale() {
  const [blown, setBlown] = useState(false);
  const [wished, setWished] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const toggle = () => {
    clearTimeout(timer.current);
    if (blown) {
      setBlown(false);
      setWished(false);
      return;
    }
    setBlown(true);
    timer.current = setTimeout(() => {
      setWished(true);
      salute(2200);
    }, CANDLES * STEP + 350);
  };

  return (
    <section className="section section--night finale" aria-labelledby="finale-title">
      <div className="container finale__inner">
        <Reveal as="p" className="eyebrow eyebrow--light">06 — Праздник</Reveal>
        <div className="finale__heading" aria-live="polite">
          {wished ? (
            <>
              <p className="finale__kicker">Муборак бошад!</p>
              <h2 id="finale-title" className="finale__title">
                С днём рождения, <span>КОИНОТИ НАВ!</span>
              </h2>
              <p className="finale__lead">Пусть сбудется всё задуманное. Верим. Можем. Создаём.</p>
            </>
          ) : (
            <>
              <p className="finale__kicker">35 свечей — 35 лет</p>
              <h2 id="finale-title" className="finale__title">
                Загадайте желание <span>для нашей команды</span>
              </h2>
              <p className="finale__lead">И задуйте свечи — по одной за каждый год пути.</p>
            </>
          )}
        </div>

        <div className={`cake ${blown ? 'is-blown' : ''}`} aria-hidden="true">
          <div className="cake__candles">
            {Array.from({ length: CANDLES }, (_, i) => (
              <span
                key={i}
                className={`candle candle--${STRIPES[i % STRIPES.length]}`}
                style={{ '--i': i, '--sway': `${(i * 37) % 11}` }}
              >
                <span className="candle__flame" />
                <span className="candle__smoke" />
              </span>
            ))}
          </div>
          <div className="cake__top">
            <span className="cake__label">1991 — 2026</span>
          </div>
        </div>

        <button type="button" className="button button--primary button--large" onClick={toggle}>
          {blown ? 'Зажечь снова' : 'Задуть свечи'}
        </button>
      </div>
    </section>
  );
}
