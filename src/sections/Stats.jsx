import { useEffect, useState } from 'react';
import { useInView } from '../lib/useInView.js';
import { prefersReducedMotion } from '../lib/motion.js';
import { STATS } from '../data.js';

const format = n => n.toLocaleString('ru-RU');

function CountUp({ value, start }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!start) return undefined;
    if (prefersReducedMotion()) {
      setShown(value);
      return undefined;
    }
    let raf = 0;
    const t0 = performance.now();
    const duration = 1600;
    const tick = now => {
      const k = Math.min(1, (now - t0) / duration);
      setShown(Math.round(value * (1 - Math.pow(1 - k, 4))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, value]);

  return format(shown);
}

export default function Stats() {
  const [ref, inView] = useInView({ threshold: 0.35 });
  return (
    <section className="stats" aria-label="КОИНОТИ НАВ в цифрах">
      <div className="container">
        <p className="eyebrow eyebrow--on-red">02 — В цифрах</p>
        <dl ref={ref} className="stats__grid">
          {STATS.map(stat => (
            <div className="stats__item" key={stat.label}>
              <dt className="stats__label">{stat.label}</dt>
              <dd className="stats__value">
                <span aria-hidden="true">
                  <CountUp value={stat.value} start={inView} />
                  {stat.suffix}
                </span>
                <span className="visually-hidden">
                  {format(stat.value)}
                  {stat.suffix}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
