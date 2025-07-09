import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'
const sql = neon(process.env.NEXT_PUBLIC_DRIZZLE_DB_URL!);
export const db = drizzle(sql,{schema});

// --- Analytics event logging utility ---
/**
 * Log an analytics event (e.g., login, caption generation, etc.)
 * @param {Object} params - Event details
 * @param {string} params.userId - User ID (or null/undefined for anonymous)
 * @param {string} params.eventType - Type of event (e.g., 'login', 'caption_generated')
 * @param {Object} [params.metadata] - Any extra info (will be stringified)
 */
export async function logAnalyticsEvent({ userId, eventType, metadata = {} }: {
  userId?: string | null;
  eventType: string;
  metadata?: Record<string, any>;
}) {
  // Use ISO string for timestamp
  const timestamp = new Date().toISOString();
  await db.insert(schema.Analytics).values({
    userId: userId || null,
    eventType,
    timestamp,
    metadata: JSON.stringify(metadata),
  });
}