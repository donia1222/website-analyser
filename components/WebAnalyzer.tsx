'use client';

import { useState, useRef, useEffect } from 'react';

interface AnalysisResult {
  design: string[];
  seo: string[];
  performance: string[];
  mobile: string[];
  accessibility: string[];
  verdict: { score: number; points: string[] };
}

function parseResults(text: string): AnalysisResult {
  // Normalize section headers
  let normalized = text
    .replace(/#+\s*(DESIGN|Design)/gi, '[DESIGN]')
    .replace(/#+\s*(SEO)/gi, '[SEO]')
    .replace(/#+\s*(PERFORMANCE|Performance)/gi, '[PERFORMANCE]')
    .replace(/#+\s*(MOBILE|Mobile)/gi, '[MOBILE]')
    .replace(/#+\s*(ACCESSIBILITY|Barrierefreiheit)/gi, '[ACCESSIBILITY]')
    .replace(/#+\s*(VERDICT|Endergebnis)/gi, '[VERDICT]');

  const extractSection = (tag: string): string => {
    const regex = new RegExp(`\\[${tag}\\]([\\s\\S]*?)(?=\\[[A-Z]+\\]|$)`, 'i');
    const match = normalized.match(regex);
    return match ? match[1].trim() : '';
  };

  const parsePoints = (raw: string): string[] => {
    return raw
      .split('\n')
      .map((l) => l.replace(/^[-•*]\s*/, '').trim())
      .filter((l) => l.length > 0 && !/^\d+$/.test(l));
  };

  const verdictRaw = extractSection('VERDICT');
  const verdictLines = verdictRaw.split('\n').map((l) => l.trim()).filter(Boolean);
  let score = 5;
  const verdictPoints: string[] = [];
  for (const line of verdictLines) {
    const num = parseInt(line.replace(/^[-•*]\s*/, ''));
    if (!isNaN(num) && num >= 0 && num <= 10 && verdictPoints.length === 0) {
      score = num;
    } else {
      verdictPoints.push(line.replace(/^[-•*]\s*/, '').trim());
    }
  }

  return {
    design: parsePoints(extractSection('DESIGN')),
    seo: parsePoints(extractSection('SEO')),
    performance: parsePoints(extractSection('PERFORMANCE')),
    mobile: parsePoints(extractSection('MOBILE')),
    accessibility: parsePoints(extractSection('ACCESSIBILITY')),
    verdict: { score, points: verdictPoints },
  };
}

function formatPoints(points: string[]): React.ReactNode {
  return (
    <ul>
      {points.map((p, i) => (
        <li key={i} dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
      ))}
    </ul>
  );
}

async function fetchWebContent(url: string): Promise<string> {
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(10000) });
    const html = await res.text();

    // Extract useful metadata
    const getTag = (pattern: RegExp) => {
      const m = html.match(pattern);
      return m ? m[1] : '';
    };

    const title = getTag(/<title[^>]*>([^<]+)<\/title>/i);
    const description = getTag(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)/i)
      || getTag(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
    const keywords = getTag(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)/i);
    const ogTitle = getTag(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)/i);
    const ogDesc = getTag(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)/i);
    const viewport = /<meta[^>]*name=["']viewport["']/i.test(html) ? 'yes' : 'no';
    const lang = getTag(/<html[^>]*lang=["']([^"']+)/i);

    // Count images without alt
    const imgTotal = (html.match(/<img/gi) || []).length;
    const imgNoAlt = (html.match(/<img(?![^>]*alt=)[^>]*>/gi) || []).length;

    // Strip tags and get body text excerpt
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyText = bodyMatch
      ? bodyMatch[1]
          .replace(/<script[\s\S]*?<\/script>/gi, '')
          .replace(/<style[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 1000)
      : '';

    return [
      `Title: ${title || 'N/A'}`,
      `Description: ${description || 'N/A'}`,
      `Keywords: ${keywords || 'N/A'}`,
      `OG Title: ${ogTitle || 'N/A'}`,
      `OG Description: ${ogDesc || 'N/A'}`,
      `Viewport meta: ${viewport}`,
      `Language: ${lang || 'N/A'}`,
      `Images total: ${imgTotal}, without alt: ${imgNoAlt}`,
      `Body excerpt: ${bodyText}`,
    ].join('\n');
  } catch {
    return `Could not fetch content from ${url}. Analyze based on URL structure only.`;
  }
}

function ScoreCircle({ score, animate }: { score: number; animate: boolean }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const [displayScore, setDisplayScore] = useState(0);
  const [dashArray, setDashArray] = useState(`0 ${circumference}`);

  const color =
    score < 3 ? '#ef4444' :
    score < 5 ? '#f97316' :
    score < 7 ? '#eab308' :
    '#22c55e';

  useEffect(() => {
    if (!animate) return;
    const target = score;
    const duration = 1000;
    const steps = 40;
    const interval = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const progress = current / steps;
      const currentScore = Math.round(progress * target);
      const dash = (progress * target / 10) * circumference;
      setDisplayScore(currentScore);
      setDashArray(`${dash} ${circumference - dash}`);
      if (current >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [animate, score, circumference]);

  return (
    <div className="score-circle-wrap">
      <svg viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#2d3650" strokeWidth="8" />
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={dashArray}
          transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dasharray 0.1s' }}
        />
      </svg>
      <div className="score-text">
        <span className="score-number">{displayScore}</span>
        <span className="score-max">/10</span>
      </div>
    </div>
  );
}

export default function WebAnalyzer() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [analyzedUrl, setAnalyzedUrl] = useState('');
  const [scoreAnimate, setScoreAnimate] = useState(false);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startProgress = () => {
    setProgress(0);
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 88) {
          clearInterval(progressRef.current!);
          return 88;
        }
        return p + Math.random() * 3;
      });
    }, 300);
  };

  const stopProgress = () => {
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(100);
  };

  const analyze = async () => {
    let inputUrl = url.trim();
    if (!inputUrl) return;
    if (!inputUrl.startsWith('http')) inputUrl = 'https://' + inputUrl;

    try { new URL(inputUrl); } catch {
      setError('Bitte geben Sie eine gültige URL ein.');
      return;
    }

    setError('');
    setLoading(true);
    startProgress();

    try {
      const websiteContent = await fetchWebContent(inputUrl);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl, websiteContent }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Analysis failed');

      stopProgress();
      const parsed = parseResults(data.botReply);
      setResults(parsed);
      setAnalyzedUrl(inputUrl);
      setScoreAnimate(false);
      setTimeout(() => {
        setModalOpen(true);
        setScoreAnimate(true);
      }, 300);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
      if (progressRef.current) clearInterval(progressRef.current);
    }
  };

  return (
    <>
      <section className="analyzer-section">
        <div className="analyzer-container">
          <div className="analyzer-header">
            <h1>
              Kostenlose<br />
              <span>Website-Analyse</span>
            </h1>
            <p>
              Geben Sie Ihre URL ein und erhalten Sie eine KI-gestützte Analyse mit konkreten
              Verbesserungsvorschlägen für Design, SEO, Performance, Mobile und Barrierefreiheit.
            </p>
          </div>

          <div className="analyzer-input-wrapper">
            <div className="analyzer-input-group">
              <svg className="analyzer-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="url"
                className="analyzer-input"
                placeholder="https://www.example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && analyze()}
                disabled={loading}
              />
              <button className="analyzer-btn" onClick={analyze} disabled={loading}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
                Analysieren
              </button>
            </div>
            <p className="analyzer-hint">Kostenlos — keine Registrierung erforderlich</p>
          </div>

          {loading && (
            <div className="analyzer-progress-wrap">
              <div className="analyzer-progress-bar">
                <div className="analyzer-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <p className="analyzer-progress-text">
                {Math.round(progress)}% — Website wird analysiert...
              </p>
            </div>
          )}

          {error && <div className="analyzer-error">{error}</div>}
        </div>
      </section>

      {/* Modal */}
      <div className={`analyzer-overlay${modalOpen ? ' open' : ''}`} onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
        <div className="analyzer-modal">
          <div className="analyzer-modal-header">
            <div>
              <h2>Website-Analyse</h2>
              <span className="analyzer-modal-url">{analyzedUrl}</span>
            </div>
            <button className="modal-close-btn" onClick={() => setModalOpen(false)} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div className="analyzer-modal-body">
            {results && (
              <>
                <div className="analyzer-cards">
                  {/* Design */}
                  <div className="analyzer-card">
                    <div className="card-header">
                      <div className="card-icon card-icon--design">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
                        </svg>
                      </div>
                      <h3>Design</h3>
                    </div>
                    <div className="card-body">{formatPoints(results.design)}</div>
                  </div>

                  {/* SEO */}
                  <div className="analyzer-card">
                    <div className="card-header">
                      <div className="card-icon card-icon--seo">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                        </svg>
                      </div>
                      <h3>SEO</h3>
                    </div>
                    <div className="card-body">{formatPoints(results.seo)}</div>
                  </div>

                  {/* Performance */}
                  <div className="analyzer-card">
                    <div className="card-header">
                      <div className="card-icon card-icon--performance">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                        </svg>
                      </div>
                      <h3>Performance</h3>
                    </div>
                    <div className="card-body">{formatPoints(results.performance)}</div>
                  </div>

                  {/* Mobile */}
                  <div className="analyzer-card">
                    <div className="card-header">
                      <div className="card-icon card-icon--mobile">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
                        </svg>
                      </div>
                      <h3>Mobile</h3>
                    </div>
                    <div className="card-body">{formatPoints(results.mobile)}</div>
                  </div>

                  {/* Accessibility */}
                  <div className="analyzer-card">
                    <div className="card-header">
                      <div className="card-icon card-icon--accessibility">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                        </svg>
                      </div>
                      <h3>Barrierefreiheit</h3>
                    </div>
                    <div className="card-body">{formatPoints(results.accessibility)}</div>
                  </div>

                  {/* Verdict */}
                  <div className="analyzer-card analyzer-card--verdict">
                    <div className="card-header">
                      <div className="card-icon card-icon--verdict">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      </div>
                      <h3>Gesamturteil</h3>
                    </div>
                    <div className="verdict-layout">
                      <ScoreCircle score={results.verdict.score} animate={scoreAnimate} />
                      <div className="card-body">{formatPoints(results.verdict.points)}</div>
                    </div>
                  </div>
                </div>

                <div className="analyzer-cta">
                  <button className="analyzer-cta-btn" onClick={() => setModalOpen(false)}>
                    Wir verbessern es für Sie →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
