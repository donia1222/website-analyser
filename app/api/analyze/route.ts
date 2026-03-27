import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { url, websiteContent } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    const systemPrompt = `Du bist ein erfahrener Web-Analyst. Analysiere die angegebene Website und gib eine strukturierte Bewertung mit konkreten Verbesserungsvorschlägen.

Deine Antwort MUSS genau diesem Format mit diesen exakten Abschnittsüberschriften folgen:

[DESIGN]
- Punkt über visuelles Design, Layout, Typografie, Farben, UX
- Punkt
- Punkt

[SEO]
- Punkt über Meta-Tags, Überschriften, Keywords, Inhaltsstruktur
- Punkt
- Punkt

[PERFORMANCE]
- Punkt über Ladegeschwindigkeit, Bilder, Code, Caching, Serverantwort
- Punkt
- Punkt

[MOBILE]
- Punkt über mobile Responsivität, Touch-Ziele, Viewport, Mobile UX
- Punkt
- Punkt

[ACCESSIBILITY]
- Punkt über Alt-Texte, Kontrast, Tastaturnavigation, ARIA, Screenreader
- Punkt
- Punkt

[VERDICT]
7
- Gesamtzusammenfassung der Website-Qualität
- Hauptstärke
- Wichtigster Verbesserungsbedarf

Regeln:
- Verwende GENAU diese Abschnittsüberschriften in eckigen Klammern
- Die Punktzahl in [VERDICT] muss eine einzelne ganze Zahl von 0 bis 10 in der ersten Zeile nach [VERDICT] sein
- Jeder Abschnitt soll 3–5 Stichpunkte haben
- Sei spezifisch und handlungsorientiert
- Schreibe auf Deutsch`;

    const userMessage = `Analyze this website: ${url}

--- Extracted website content ---
${websiteContent}`;

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: userMessage },
    ]);

    const botReply = result.response.text();

    return NextResponse.json({ status: 'success', botReply });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Analyse fehlgeschlagen. Bitte versuchen Sie es erneut.' },
      { status: 500 }
    );
  }
}
