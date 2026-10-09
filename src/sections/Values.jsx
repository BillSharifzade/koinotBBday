import Reveal from '../lib/Reveal.jsx';
import { VALUES } from '../data.js';

export default function Values() {
  return (
    <section className="section section--plum values" aria-labelledby="values-title">
      <div className="container">
        <div className="section-head">
          <Reveal as="p" className="eyebrow eyebrow--light">05 — Наши ценности</Reveal>
          <Reveal as="h2" id="values-title" className="section-title" delay={80}>
            На чём мы стоим
          </Reveal>
          <Reveal as="p" className="section-lead" delay={160}>
            В нас сочетаются инновации и традиции. Мы знак истинного качества, символ верности и преданности своему
            делу, своему обществу и стране.
          </Reveal>
        </div>
        <ul className="values__grid">
          {VALUES.map((value, i) => (
            <Reveal as="li" key={value.title} className="value-card" delay={(i % 3) * 90}>
              <span className="value-card__index">0{i + 1}</span>
              <h3 className="value-card__title">{value.title}</h3>
              <p className="value-card__text">{value.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
