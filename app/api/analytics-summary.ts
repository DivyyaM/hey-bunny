import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { Analytics } from '@/utils/schema';

// Simple API route to get analytics summary for dashboard
export async function GET() {
  // Get all analytics events
  const events = await db.select().from(Analytics);

  // Only keep events from the last 30 days and with valid timestamp/eventType
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const sinceIso = since.toISOString();
  const filtered = events.filter(event => {
    return (
      event.timestamp &&
      event.eventType &&
      event.timestamp >= sinceIso
    );
  });

  // Group by day and event type
  const summary: Record<string, Record<string, number>> = {};
  for (const event of filtered) {
    const day = event.timestamp!.slice(0, 10); // YYYY-MM-DD
    if (!summary[day]) summary[day] = { login: 0, caption_generated: 0, post_published: 0 };
    if (event.eventType && event.eventType in summary[day]) {
      summary[day][event.eventType]++;
    }
  }

  return NextResponse.json({ summary });
} 