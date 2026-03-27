'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  
  useEffect(() => {
    if (!localStorage.getItem('cookie_consent')) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
  }

  function decline() {
    localStorage.setItem('cookie_consent', 'declined');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
      <div className="cookie-banner-inner">
        <p className="cookie-text">
          We use a functional cookie to remember your preference.
          No tracking or advertising cookies.{' '}
          <Link href="/privacy" className="cookie-link">Privacy Policy</Link>
        </p>
        <div className="cookie-actions">
          <button className="cookie-btn cookie-btn--decline" onClick={decline}>Decline</button>
          <button className="cookie-btn cookie-btn--accept" onClick={accept}>Accept</button>
        </div>
      </div>
    </div>
  );
}
