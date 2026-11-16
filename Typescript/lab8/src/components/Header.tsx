import './Header.scss'

export function Header() {
  return (
    <header className="header">
      <a className="header__brand" href="./" aria-label="Study Planner — головна">
        <span className="header__icon" aria-hidden="true">S</span>
        <span>study<span className="header__brand-accent">planner</span></span>
      </a>
      <div className="header__label">
        <span className="header__status" aria-hidden="true" />
        Ваш навчальний простір
      </div>
    </header>
  )
}
