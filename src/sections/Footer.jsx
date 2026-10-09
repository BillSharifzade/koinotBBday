import logoWhite from '../assets/logo-full-white.svg';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <img className="footer__logo" src={logoWhite} alt="КОИНОТИ НАВ — новое пространство жизни" width="190" height="32" />
        <p className="footer__motto">Верим. Можем. Создаём.</p>
        <nav className="footer__links" aria-label="Контакты">
          <a href="https://koinotinav.tj/" target="_blank" rel="noopener noreferrer">koinotinav.tj</a>
          <a href="mailto:info@koinotinav.tj">info@koinotinav.tj</a>
        </nav>
        <p className="footer__copy">© 1991 — 2026 Группа компаний «КОИНОТИ НАВ»</p>
      </div>
    </footer>
  );
}
