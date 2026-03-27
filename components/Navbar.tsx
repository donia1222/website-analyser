export default function Navbar() {
  return (
    <header className="app-navbar">
      <div className="app-navbar-inner">
        {/* Logo */}
        <div className="app-navbar-brand">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fe6c75" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <span>Website <strong>Analyser</strong></span>
        </div>

        {/* Right badge */}
        <div className="app-navbar-badge">
          <span className="badge-dot" />
          Free · No registration
        </div>
      </div>
    </header>
  );
}
