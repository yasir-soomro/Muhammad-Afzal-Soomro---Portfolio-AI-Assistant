import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/lib/gemini';
import { portfolioData, validProjectIds } from '@/lib/portfolio-schema';

// In-memory sliding window rate limiter
// Note: In serverless/container multi-instance deployments, this tracks per-instance.
interface RateRecord {
  count: number;
  resetAt: number;
}
const ipRateMap = new Map<string, RateRecord>();
const RATE_LIMIT_MAX = 10; // Max requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipRateMap.get(ip);

  if (!record || now > record.resetAt) {
    ipRateMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count += 1;
  return true;
}

// Clean up stale rate limits every 5 minutes to prevent memory leak
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipRateMap.entries()) {
      if (now > record.resetAt) {
        ipRateMap.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}

const SYSTEM_INSTRUCTION = `You are the verified AI portfolio assistant for Muhammad Afzal Soomro, a Full-Stack Developer.
Your sole mission is to answer questions truthfully and accurately using ONLY the provided verified developer profile below.

=== VERIFIED PORTFOLIO KNOWLEDGE BASE ===
${JSON.stringify(portfolioData, null, 2)}
=========================================

STRICT RULES & CONSTRAINTS:
1. TRUTHFULNESS & GROUNDING:
   - Answer strictly from the provided portfolio data.
   - Do NOT invent, assume, or hallucinate any projects, employers, metrics, credentials, or technologies not listed.
   - If asked about an unlisted technology (e.g. AWS, Kubernetes, Rust, Vue), state clearly: "Muhammad's verified portfolio does not list experience with [technology]. His core competencies focus on TypeScript, Next.js, React, Node.js, and REST APIs."
   - If asked about personal matters or off-topic subjects, politely guide the visitor back to Muhammad's technical projects and experience.

2. PROJECT STATUS:
   - 'Zentrix Store' is a completed full-stack e-commerce project.
   - 'Real Estate Lead Management API' is currently IN PROGRESS as a backend REST service. Never describe it as fully completed.

3. STRUCTURED OUTPUT FORMAT:
   - You MUST output your response as a valid JSON object matching this exact schema:
     {
       "answer": "A clear, concise, professional response to the visitor's question in 1 to 4 sentences.",
       "citedProjectIds": ["project-id"]
     }
   - 'citedProjectIds' must ONLY contain IDs from this list if directly discussed in your answer: ${JSON.stringify(validProjectIds)}. If no project is directly relevant, provide an empty array [].
   - Do NOT wrap your JSON in markdown code blocks. Output raw JSON only.`;

export async function POST(req: NextRequest) {
  try {
    // 1. Secret Configuration Check
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service configuration missing on the server' },
        { status: 500 }
      );
    }

    // 2. Rate Limiting Check
    const forwardedFor = req.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Rate limit reached (10 requests per minute). Please wait a moment before sending another query.' },
        { status: 429 }
      );
    }

    // 3. Request Body Parsing & Input Validation
    let body: { message?: unknown; history?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Malformed JSON payload' },
        { status: 400 }
      );
    }

    const { message, history } = body;

    if (typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message must be a string' },
        { status: 400 }
      );
    }

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    if (trimmedMessage.length > 500) {
      return NextResponse.json(
        { error: 'Message exceeds maximum allowed length of 500 characters' },
        { status: 400 }
      );
    }

    // 4. Sanitize and Bound Conversation History (Max 10 turns)
    const formattedHistory: Array<{ role: 'user' | 'model'; parts: [{ text: string }] }> = [];
    if (Array.isArray(history)) {
      const boundedHistory = history.slice(-10);
      for (const turn of boundedHistory) {
        if (
          turn &&
          typeof turn === 'object' &&
          (turn.role === 'user' || turn.role === 'assistant') &&
          typeof turn.content === 'string' &&
          turn.content.trim()
        ) {
          formattedHistory.push({
            role: turn.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: turn.content.slice(0, 500) }],
          });
        }
      }
    }

    // 5. Model Execution with 15-second Timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let rawOutput = '';
    try {
      const contents = [
        ...formattedHistory,
        {
          role: 'user' as const,
          parts: [{ text: trimmedMessage }],
        },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.2, // Low temperature for high factual adherence
          responseMimeType: 'application/json',
        },
      });

      rawOutput = response.text || '';
    } catch (genError: unknown) {
      clearTimeout(timeoutId);
      if (controller.signal.aborted) {
        return NextResponse.json(
          { error: 'AI request timed out after 15 seconds. Please try again.' },
          { status: 504 }
        );
      }
      console.error('[Gemini API Call Failed]:', genError);
      return NextResponse.json(
        { error: 'Upstream AI provider error. Please try again shortly.' },
        { status: 503 }
      );
    } finally {
      clearTimeout(timeoutId);
    }

    // 6. Output Parsing & Server Citation Validation
    let parsed: { answer?: string; citedProjectIds?: string[] } = {};
    try {
      parsed = JSON.parse(rawOutput.trim());
    } catch (e) {
      console.warn('[Gemini Parse Fallback]: Could not parse response as JSON. Raw:', rawOutput, e);
      parsed = { answer: rawOutput.trim(), citedProjectIds: [] };
    }

    const answer = typeof parsed.answer === 'string' && parsed.answer.trim()
      ? parsed.answer.trim()
      : 'I am here to answer questions about Muhammad Afzal Soomro’s verified projects and skills.';

    // Strictly sanitize and validate citedProjectIds against valid portfolio IDs
    const validIdSet = new Set(validProjectIds);
    const sanitizedCitations: string[] = [];

    if (Array.isArray(parsed.citedProjectIds)) {
      for (const id of parsed.citedProjectIds) {
        if (typeof id === 'string' && validIdSet.has(id) && !sanitizedCitations.includes(id)) {
          sanitizedCitations.push(id);
        }
      }
    }

    return NextResponse.json({
      answer,
      citedProjectIds: sanitizedCitations,
    });
  } catch (err: unknown) {
    console.error('[Unhandled Chat Route Error]:', err);
    return NextResponse.json(
      { error: 'Internal server error while processing request' },
      { status: 500 }
    );
  }
}
