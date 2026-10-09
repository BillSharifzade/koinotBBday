import { useCallback, useEffect, useRef, useState } from 'react';
import Reveal from '../lib/Reveal.jsx';
import { salute } from '../lib/celebrate.js';
import { useBlowDetector } from '../lib/useBlowDetector.js';

const CANDLES = 35;
const STRIPES = ['red', 'lavender', 'white'];
const CANDLES_PER_SECOND = 50; // at full blowing strength, so a strong ~0.7 s "pooof" clears the cake
const TAP_STEP = 45; // ms between candles when the cake is tapped instead

const HINTS = {
  idle: 'Подуйте на свечи — микрофон услышит вас',
  requesting: 'Разрешите доступ к микрофону и подуйте на свечи. Звук никуда не записывается',
  suspended: 'Коснитесь экрана, чтобы микрофон вас услышал',
  listening: 'Микрофон слушает — подуйте на свечи',
  denied: 'Микрофон недоступен — нажмите на торт, чтобы задуть свечи',
  unavailable: 'Микрофон недоступен — нажмите на торт, чтобы задуть свечи',
};

// Candles go out in a random order, like a real breath across a cake.
function randomRanks(n) {
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const ranks = [];
  order.forEach((candle, rank) => {
    ranks[candle] = rank;
  });
  return ranks;
}

export default function Finale() {
  const sectionRef = useRef(null);
  const blownRef = useRef(0); // fractional number of candles blown out so far
  const tapTimer = useRef(0);
  const [ranks] = useState(() => randomRanks(CANDLES));
  const [inView, setInView] = useState(false);
  const [out, setOut] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const allOut = out >= CANDLES;

  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  const blow = useCallback((amount) => {
    blownRef.current = Math.min(CANDLES, blownRef.current + amount);
    const next = Math.floor(blownRef.current);
    setOut((prev) => Math.max(prev, next));
  }, []);

  const status = useBlowDetector(inView && !allOut, {
    onLevel: (level) => sectionRef.current?.style.setProperty('--wind', level.toFixed(3)),
    onBlow: (strength, dt) => blow(strength * CANDLES_PER_SECOND * dt),
  });

  useEffect(() => {
    if (!allOut) {
      setCelebrating(false);
      return undefined;
    }
    const timer = setTimeout(() => {
      setCelebrating(true);
      salute(2200);
    }, 450);
    return () => clearTimeout(timer);
  }, [allOut]);

  useEffect(() => () => clearInterval(tapTimer.current), []);

  // Fallback for visitors without a microphone; also relights the cake.
  const onCakeClick = () => {
    clearInterval(tapTimer.current);
    if (allOut) {
      blownRef.current = 0;
      setOut(0);
      return;
    }
    // While audio is starting, a tap only wakes the microphone up.
    if (status === 'requesting' || status === 'suspended') return;
    tapTimer.current = setInterval(() => {
      blow(1);
      if (blownRef.current >= CANDLES) clearInterval(tapTimer.current);
    }, TAP_STEP);
  };

  const hint = allOut ? 'Нажмите на торт, чтобы зажечь свечи снова' : HINTS[status];

  return (
    <section ref={sectionRef} className="section section--night finale" aria-labelledby="finale-title">
      <div className="container finale__inner">
        <Reveal as="p" className="eyebrow eyebrow--light">
          04 — Праздник
        </Reveal>
        <div className="finale__heading" aria-live="polite">
          {celebrating ? (
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
              <p className="finale__lead">И подуйте на свечи — по одной за каждый год пути.</p>
            </>
          )}
        </div>

        <button
          type="button"
          className="cake"
          onClick={onCakeClick}
          aria-label={allOut ? 'Зажечь свечи снова' : 'Задуть свечи'}
        >
          <span className="cake__candles" aria-hidden="true">
            {Array.from({ length: CANDLES }, (_, i) => (
              <span
                key={i}
                className={`candle candle--${STRIPES[i % STRIPES.length]} ${ranks[i] < out ? 'is-out' : ''}`}
                style={{ '--sway': (i * 37) % 11 }}
              >
                <span className="candle__flame" />
                <span className="candle__smoke" />
              </span>
            ))}
          </span>
          <span className="cake__top" aria-hidden="true">
            <span className="cake__label">1991 — 2026</span>
          </span>
        </button>

        <p className={`mic mic--${allOut ? 'done' : status}`} role="status">
          <MicIcon />
          <span>{hint}</span>
          {status === 'listening' && !allOut && (
            <span className="mic__meter" aria-hidden="true">
              <span />
            </span>
          )}
        </p>
      </div>
    </section>
  );
}

function MicIcon() {
  return (
    <svg className="mic__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
