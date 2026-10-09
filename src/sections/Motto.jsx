import Reveal from '../lib/Reveal.jsx';
import { MOTTO } from '../data.js';

export default function Motto() {
  return (
    <section className="section section--night motto" aria-labelledby="motto-title">
      <div className="container">
        <Reveal as="p" className="eyebrow">01 — Наш девиз</Reveal>
        <h2 id="motto-title" className="visually-hidden">Верим. Можем. Создаём.</h2>
        <ol className="motto__list">
          {MOTTO.map((item, i) => (
            <Reveal as="li" key={item.word} className="motto__row" delay={i * 120}>
              <span className="motto__index">0{i + 1}</span>
              <span className="motto__word" aria-hidden="true">
                {item.word}
                <span className="motto__dot">.</span>
              </span>
              <p className="motto__text">
                <strong>{item.word}</strong> {item.text}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
