import { memo, useEffect, useState } from 'react';
import Ballpit from '../components/Ballpit/Ballpit.jsx';
import ElectricLogo from '../components/ElectricLogo/ElectricLogo.jsx';
import logoMark from '../assets/logo-mark.svg';
import logoWhite from '../assets/logo-full-white.svg';
import { renderTextImage } from '../lib/textImage.js';
import { prefersReducedMotion } from '../lib/motion.js';
import { cannons } from '../lib/celebrate.js';

// Brand red, lavender and plum, with a few light "foil" balloons.
const BALL_COLORS = ['#ED2E38', '#ED2E38', '#8775A4', '#F4F1F7', '#5A4B70', '#ED2E38', '#B9AAD3', '#ED2E38'];

const SHAPES = {
  mark: { color: '#FFE3E5', glowColor: '#ED2E38', hold: 5200 },
  years: { color: '#F3EEFF', glowColor: '#9D86C7', hold: 4200 }
};

function ballCount() {
  const aspect = window.innerWidth / window.innerHeight;
  if (aspect < 0.8) return 30;
  if (aspect < 1.2) return 55;
  return 85;
}

// Memoised with stable props: Ballpit re-applies its config (and re-rolls ball
// sizes) whenever it re-renders, so it must never re-render after mount.
const Balloons = memo(function Balloons({ count }) {
  return (
    <div className="hero__balls" aria-hidden="true">
      <Ballpit
        className="hero__balls-canvas"
        count={count}
        colors={BALL_COLORS}
        gravity={0.45}
        friction={0.9}
        wallBounce={0.95}
        minSize={0.35}
        maxSize={0.8}
        size0={0.2}
        ambientIntensity={1.1}
        lightIntensity={140}
        followCursor={false}
      />
    </div>
  );
});

// The electric logo morphs between the KN mark and "35".
function ElectricStage() {
  const [yearsSrc, setYearsSrc] = useState(null);
  const [shape, setShape] = useState('mark');

  useEffect(() => {
    let alive = true;
    renderTextImage('35').then(url => alive && setYearsSrc(url));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!yearsSrc || prefersReducedMotion()) return undefined;
    const timer = setTimeout(() => setShape(s => (s === 'mark' ? 'years' : 'mark')), SHAPES[shape].hold);
    return () => clearTimeout(timer);
  }, [shape, yearsSrc]);

  const { color, glowColor } = SHAPES[shape];
  return (
    <div className="hero__stage" aria-hidden="true">
      <ElectricLogo
        src={shape === 'years' ? yearsSrc : logoMark}
        color={color}
        glowColor={glowColor}
        scale={0.78}
        intensity={1.15}
        glow={1.1}
        thickness={1.6}
        strands={4}
        bend={0.6}
        crackle={1.5}
        arcs={1.2}
        flicker={0.5}
        fill={0.28}
        speed={2.2}
        cursorRadius={120}
        interactive
      />
    </div>
  );
}

export default function Hero() {
  const [count] = useState(ballCount);

  useEffect(() => {
    const timer = setTimeout(cannons, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero" id="top">
      <Balloons count={count} />

      <header className="hero__bar">
        <img className="hero__logo" src={logoWhite} alt="КОИНОТИ НАВ — новое пространство жизни" width="190" height="32" />
        <span className="hero__years">1991 — 2026</span>
      </header>

      <div className="hero__content">
        <ElectricStage />
        <p className="eyebrow eyebrow--light">Группа компаний «КОИНОТИ НАВ» · 35 лет</p>
        <h1 className="hero__title">
          С днём рождения,
          <span className="hero__brand">КОИНОТИ НАВ!</span>
        </h1>
        <p className="hero__lead">Уже 35 лет мы верим, можем и создаём.</p>
        <a className="button button--primary" href="#congratulate">
          <ConfettiIcon />
          Поздравить
        </a>
      </div>
    </section>
  );
}

function ConfettiIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20l5.5-14L18 14.5 4 20z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 4.5c.6 1.2.4 2.3-.6 3.1M19.5 10c-1.2-.5-2.3-.2-3.1.8M17 3.5l.6 1.4M21 7l-1.4.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
