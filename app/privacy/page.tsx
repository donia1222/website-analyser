import Navbar from '@/components/Navbar';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy – Website Analyser',
  description: 'Privacy policy for Website Analyser by Lweb.',
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="legal-page">
        <div className="legal-container">
          <Link href="/" className="legal-back">← Back</Link>

          <h1>Privacy Policy</h1>
          <p className="legal-date">Last updated: March 2026</p>

          <h2>1. Controller</h2>
          <p>
            This website is operated by <strong>Lweb</strong> (<a href="https://lweb.ch" target="_blank" rel="noopener noreferrer">lweb.ch</a>).
            For any privacy-related enquiries, please contact us via the contact form on our website.
          </p>

          <h2>2. Data we collect</h2>
          <p>When you use Website Analyser, we may process the following data:</p>
          <ul>
            <li><strong>URLs you submit</strong> – the web address you enter for analysis. This is sent to our server to perform the audit and is not stored permanently.</li>
            <li><strong>Server logs</strong> – standard web server logs (IP address, browser type, timestamp, requested URL). These are retained for up to 30 days for security and diagnostic purposes.</li>
            <li><strong>Cookies</strong> – we use a single functional cookie to remember your cookie-consent preference. No tracking or advertising cookies are used.</li>
          </ul>

          <h2>3. Legal basis (GDPR)</h2>
          <p>
            Processing of server logs is based on our legitimate interest in operating a secure and functional service (Art. 6(1)(f) GDPR).
            The consent cookie is based on your explicit consent (Art. 6(1)(a) GDPR).
          </p>

          <h2>4. Third-party services</h2>
          <p>
            The AI analysis is powered by the Anthropic Claude API. URLs you submit are forwarded to Anthropic's servers for processing.
            Anthropic's privacy policy applies: <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer">anthropic.com/privacy</a>.
          </p>
          <p>
            We do not use Google Analytics, Facebook Pixel, or any other third-party tracking service.
          </p>

          <h2>5. Data sharing</h2>
          <p>
            We do not sell, rent, or share your personal data with third parties, except as necessary to provide the service (Anthropic API, see above)
            or as required by law.
          </p>

          <h2>6. Data retention</h2>
          <p>
            Server logs are deleted after 30 days. Submitted URLs are not stored after the analysis is complete.
          </p>

          <h2>7. Your rights</h2>
          <p>Under GDPR you have the right to access, rectify, erase, restrict or object to the processing of your data, and the right to data portability.
            To exercise these rights, please contact us via <a href="https://lweb.ch" target="_blank" rel="noopener noreferrer">lweb.ch</a>.
          </p>
          <p>You also have the right to lodge a complaint with your local data-protection authority.</p>

          <h2>8. Cookies</h2>
          <p>
            We use one cookie named <code>cookie_consent</code> to store whether you have accepted this notice. It expires after 365 days.
            No other cookies are set. You can delete it at any time via your browser settings.
          </p>

          <h2>9. Changes to this policy</h2>
          <p>
            We may update this policy occasionally. The date at the top of this page shows when it was last revised.
            Continued use of the service after changes constitutes acceptance of the updated policy.
          </p>
        </div>
      </main>
    </>
  );
}
