import Navbar from '@/components/Navbar';
import WebAnalyzer from '@/components/WebAnalyzer';
import Link from 'next/link';

const STEPS = [
  {
    num: '01',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
    title: 'URL eingeben',
    desc: 'Fügen Sie eine beliebige Website-Adresse ein – Ihre eigene Seite, die eines Mitbewerbers oder eine Seite, die Sie bewerten möchten.',
  },
  {
    num: '02',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 2a10 10 0 0 1 10 10"/>
        <path d="M12 12 2.1 9.1"/>
      </svg>
    ),
    title: 'KI scannt die Seite',
    desc: 'Unsere KI liest Seitenstruktur, Metadaten, Inhalte und technische Signale in Sekundenschnelle.',
  },
  {
    num: '03',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: 'Vollständigen Bericht erhalten',
    desc: 'Erhalten Sie ein strukturiertes Audit mit einer Punktzahl von 10 und konkreten Verbesserungsvorschlägen für jeden Bereich.',
  },
];

const FEATURES = [
  {
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.08)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    title: 'Design',
    desc: 'Visuelle Hierarchie, Layout-Konsistenz, Typografie, Farbgebung und allgemeine Benutzererfahrung.',
  },
  {
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'SEO',
    desc: 'Meta-Tags, Überschriftenstruktur, Keyword-Nutzung, Open Graph und Qualitätssignale der Inhalte.',
  },
  {
    color: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    title: 'Performance',
    desc: 'Seitengewicht, Bildoptimierung, render-blockierende Ressourcen und Caching-Best-Practices.',
  },
  {
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.08)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
    title: 'Mobile',
    desc: 'Viewport-Einstellungen, responsives Layout, Touch-Ziele und Mobile-First-Usability.',
  },
  {
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.08)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4"/><path d="M12 16h.01"/>
      </svg>
    ),
    title: 'Barrierefreiheit',
    desc: 'Alt-Texte, Farbkontrast, Tastaturnavigation, ARIA-Labels und semantisches HTML.',
  },
  {
    color: '#fe6c75',
    bg: 'rgba(254,108,117,0.08)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: 'Gesamtbewertung',
    desc: 'Eine abschliessende Punktzahl von 0–10 mit einem Gesamturteil, Ihrer grössten Stärke und dem wichtigsten Verbesserungspunkt.',
  },
];

export default function Home() {
  return (
    <>
      <Navbar />

      {/* ── Hero: the analyser tool ── */}
      <WebAnalyzer />

      {/* ── How it works ── */}
      <section className="landing-section landing-section--gray">
        <div className="landing-container">
          <div className="landing-eyebrow">So funktioniert es</div>
          <h2 className="landing-h2">3 Schritte zu einer besseren Website</h2>
          <p className="landing-subtext">
            Kein Konto, kein Warten. Einfach URL einfügen und in unter 30 Sekunden ein vollständiges KI-Audit erhalten.
          </p>

          <div className="landing-steps">
            {STEPS.map((s) => (
              <div key={s.num} className="landing-step-card">
                <div className="step-num">{s.num}</div>
                <div className="step-icon-wrap">{s.icon}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What we analyse ── */}
      <section className="landing-section">
        <div className="landing-container">
          <div className="landing-eyebrow">Was wir analysieren</div>
          <h2 className="landing-h2">Ein vollständiges Audit – sofort</h2>
          <p className="landing-subtext">
            Sechs Kategorien, jeweils mit detaillierten Punkten und umsetzbarem Feedback – alles von KI generiert.
          </p>

          <div className="landing-features">
            {FEATURES.map((f) => (
              <div key={f.title} className="landing-feature-card">
                <div className="feature-icon-wrap" style={{ background: f.bg, color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="landing-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div className="footer-brand">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fe6c75" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <span>Website <strong>Analyser</strong></span>
          </div>
          <div className="footer-links">
            <span>Kostenloses KI-gestütztes Website-Audit</span>
            <span className="footer-dot">·</span>
            <a href="https://lweb.ch" target="_blank" rel="noopener noreferrer">Built by Lweb</a>
            <span className="footer-dot">·</span>
            <Link href="/privacy">Privacy Policy</Link>
            <span className="footer-dot">·</span>
            <Link href="/impressum">Impressum</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
