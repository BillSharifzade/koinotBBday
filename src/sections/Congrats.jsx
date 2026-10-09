import { useEffect, useRef, useState } from 'react';
import Reveal from '../lib/Reveal.jsx';
import { salute } from '../lib/celebrate.js';
import { BOT_URL, BOT_USERNAME, MAX_NAME, MAX_TEXT, sendCongrats } from '../lib/bot.js';

const ERRORS = {
  name: 'Напишите, как вас зовут.',
  text: 'Напишите поздравление — хотя бы пару слов.',
  network: 'Не получилось отправить. Проверьте интернет и попробуйте ещё раз.'
};

export default function Congrats() {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [error, setError] = useState('');
  const thanksRef = useRef(null);
  const textRef = useRef(null);
  const wroteAgain = useRef(false);

  // Keep keyboard focus in the card when the form and the thank-you swap places.
  useEffect(() => {
    if (status === 'sent') thanksRef.current?.focus();
    if (status === 'idle' && wroteAgain.current) {
      wroteAgain.current = false;
      textRef.current?.focus();
    }
  }, [status]);

  const onSubmit = async event => {
    event.preventDefault();
    const website = new FormData(event.currentTarget).get('website');
    setStatus('sending');
    setError('');
    const result = await sendCongrats({ name, text, website });
    if (result.ok) {
      setText('');
      setStatus('sent');
      salute();
      return;
    }
    setStatus('idle');
    setError(
      result.error === 'cooldown'
        ? `Вы только что отправили поздравление — следующее можно через ${result.retryAfter} с.`
        : ERRORS[result.error] ?? ERRORS.network
    );
  };

  const writeAgain = () => {
    wroteAgain.current = true;
    setStatus('idle');
  };

  return (
    <section id="congratulate" className="section section--plum congrats" aria-labelledby="congrats-title">
      <div className="container congrats__inner">
        <div className="congrats__intro">
          <Reveal as="p" className="eyebrow eyebrow--light">
            05 — Поздравления
          </Reveal>
          <Reveal as="h2" id="congrats-title" className="section-title" delay={80}>
            Поздравьте <span>КОИНОТИ НАВ</span>
          </Reveal>
          <Reveal as="p" className="section-lead" delay={160}>
            Напишите несколько тёплых слов — их сразу получат все, кто подписан на праздничного бота в Telegram.
          </Reveal>
          <Reveal className="congrats__bot" delay={240}>
            <PlaneIcon />
            <p>
              Хотите читать все поздравления? Откройте{' '}
              <a href={BOT_URL} target="_blank" rel="noopener noreferrer">
                @{BOT_USERNAME}
              </a>{' '}
              и нажмите «Старт». Поздравить можно и прямо в боте.
            </p>
          </Reveal>
        </div>

        <Reveal className="congrats__card" delay={120}>
          {status === 'sent' ? (
            <div className="congrats__thanks" ref={thanksRef} tabIndex={-1} role="status">
              <p className="congrats__thanks-title">Спасибо!</p>
              <p>Ваше поздравление уже летит в Telegram всем подписчикам бота.</p>
              <div className="congrats__actions">
                <button type="button" className="button button--primary" onClick={writeAgain}>
                  Написать ещё
                </button>
                <a className="button button--ghost" href={BOT_URL} target="_blank" rel="noopener noreferrer">
                  Открыть бота
                </a>
              </div>
            </div>
          ) : (
            <form className="congrats__form" onSubmit={onSubmit}>
              <label className="field">
                <span className="field__label">Ваше имя</span>
                <input
                  className="field__input"
                  name="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  maxLength={MAX_NAME}
                  autoComplete="name"
                  placeholder="Например: Фарход, отдел продаж"
                  required
                />
              </label>
              <label className="field">
                <span className="field__label">Поздравление</span>
                <textarea
                  ref={textRef}
                  className="field__input field__input--area"
                  name="text"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  maxLength={MAX_TEXT}
                  rows={6}
                  placeholder="Дорогие коллеги! От всей души поздравляю…"
                  required
                />
                <span className="field__count" aria-hidden="true">
                  {text.length} / {MAX_TEXT}
                </span>
              </label>
              {/* Honeypot: hidden from people, filled in by spam bots. */}
              <div className="congrats__trap" aria-hidden="true">
                <label>
                  Сайт <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              {error && (
                <p className="congrats__error" role="alert">
                  {error}
                </p>
              )}
              <button type="submit" className="button button--primary" disabled={status === 'sending'}>
                <PlaneIcon />
                {status === 'sending' ? 'Отправляем…' : 'Отправить'}
              </button>
              <p className="congrats__note">Поздравление с вашим именем увидят все подписчики бота.</p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function PlaneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 3.5 2.8 10.6c-.8.3-.8 1.4 0 1.7l4.5 1.6 1.7 5.4c.2.7 1.1.9 1.6.4l2.6-2.5 4.6 3.4c.6.4 1.4.1 1.6-.6L22.3 4.8c.2-.9-.6-1.6-1.3-1.3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="m7.3 13.9 9.9-6.4-6.8 7.6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
