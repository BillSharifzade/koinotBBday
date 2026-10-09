import { useEffect, useRef } from 'react';
import Reveal from '../lib/Reveal.jsx';
import { COMPANIES, TIMELINE } from '../data.js';

export default function Timeline() {
  const trackRef = useRef(null);

  // Fill the red line as the reader scrolls through the years.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = track.getBoundingClientRect();
      const anchor = window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height));
      track.style.setProperty('--progress', p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section className="section section--mist timeline" aria-labelledby="timeline-title">
      <div className="container">
        <div className="section-head">
          <Reveal as="p" className="eyebrow">03 — История</Reveal>
          <Reveal as="h2" id="timeline-title" className="section-title" delay={80}>
            35 лет пути
          </Reveal>
          <Reveal as="p" className="section-lead" delay={160}>
            Группа компаний «КОИНОТИ НАВ» образована в 1991 году. Сегодня это фармацевтика, продукты питания и
            ритейл, автомобили, технологии и образование — и сотни сотрудников, объединённых одной Миссией.
          </Reveal>
        </div>

        <ol className="timeline__track" ref={trackRef}>
          {TIMELINE.map((item, i) => (
            <Reveal
              as="li"
              key={item.era}
              className={`timeline__item ${i % 2 ? 'timeline__item--right' : ''} ${item.highlight ? 'timeline__item--highlight' : ''}`}
            >
              <span className="timeline__dot" aria-hidden="true" />
              <article className="timeline__card">
                <p className="timeline__era">{item.era}</p>
                <h3 className="timeline__title">{item.title}</h3>
                <p className="timeline__text">{item.text}</p>
                {item.logos && (
                  <ul className="timeline__logos">
                    {item.logos.map(key => (
                      <li key={key}>
                        <img src={COMPANIES[key].logo} alt={COMPANIES[key].name} loading="lazy" />
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
