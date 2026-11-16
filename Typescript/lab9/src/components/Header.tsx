import './Header.scss'

export function Header() {
  return (
    <header className="header">
      <a className="header__brand" href="./" aria-label="Study Planner — головна">
        <span className="header__icon" aria-hidden="true">S</span>
        <span>study<span className="header__brand-accent">planner</span></span>
      </a>
      <span className="header__label">Ваш навчальний простір</span>
    </header>
  )
}
