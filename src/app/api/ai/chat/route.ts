import { streamText } from 'ai';
import { openai }      from '@ai-sdk/openai';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  /* Fallback‑стрім, якщо ключа немає */
  if (!process.env.OPENAI_API_KEY) {
    const encoder = new TextEncoder();
    const mock = new ReadableStream({
      async start(controller) {
        for (const tok of ['This ', 'is ', 'mock ', 'AI ', 'response.']) {
          controller.enqueue(encoder.encode(tok));
          await new Promise(r => setTimeout(r, 100));
        }
        controller.close();
      }
    });
    return new Response(mock, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  /* Реальний стрім OpenAI — apiKey береться з env */
  try {
    const result = await streamText({
      model: openai('gpt-4o-mini'),
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        ...messages.map((m: { role: 'user' | 'ai'; text: string }) => ({
          role: m.role === 'ai' ? 'assistant' : m.role,
          content: m.text
        }))
      ],
      temperature: 0.7
    });

    return result.toTextStreamResponse();
  } catch (err) {
    console.error('OpenAI error:', err);
    return new Response('OpenAI error: ' + (err as Error).message, { status: 500 });
  }
}
