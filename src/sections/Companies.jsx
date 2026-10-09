import Reveal from '../lib/Reveal.jsx';
import { COMPANIES, COMPANY_ROWS } from '../data.js';

function LogoCard({ id, hidden }) {
  const company = COMPANIES[id];
  const img = <img src={company.logo} alt={hidden ? '' : company.name} loading="lazy" />;
  const props = { className: 'logo-card', title: company.name, 'aria-hidden': hidden || undefined };
  return company.url ? (
    <a {...props} href={company.url} target="_blank" rel="noopener noreferrer" tabIndex={hidden ? -1 : undefined}>
      {img}
    </a>
  ) : (
    <div {...props}>{img}</div>
  );
}

export default function Companies() {
  return (
    <section className="section section--white companies" aria-labelledby="companies-title">
      <div className="container">
        <div className="section-head">
          <Reveal as="p" className="eyebrow">04 — Семья компаний</Reveal>
          <Reveal as="h2" id="companies-title" className="section-title" delay={80}>
            <span>15 компаний.</span>
            <span>Одна миссия.</span>
          </Reveal>
          <Reveal as="p" className="section-lead" delay={160}>
            Наша миссия — способствовать общественному благополучию через устойчивое развитие компаний и социальную
            ответственность.
          </Reveal>
        </div>
      </div>

      <div className="marquee-group">
        {COMPANY_ROWS.map((row, r) => (
          <div className={`marquee ${r % 2 ? 'marquee--reverse' : ''}`} key={r}>
            <div className="marquee__inner">
              {[0, 1].map(copy => (
                <div className="marquee__set" key={copy}>
                  {row.map(id => (
                    <LogoCard key={id} id={id} hidden={copy === 1} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
