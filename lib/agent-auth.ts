import { createHash } from 'crypto';
import { eq } from 'drizzle-orm';
import { db, agentApiKeys } from '@/lib/db';

export interface AgentAuthResult {
  userId: string;
  keyId: string;
}

/**
 * Authenticate an agent request via X-API-Key header.
 *
 * Looks up the SHA-256 hash of the provided key in the agent_api_keys table.
 * Returns the associated userId if found, or null if invalid/missing.
 */
export async function authenticateAgent(
  req: Request
): Promise<AgentAuthResult | null> {
  const apiKey = req.headers.get('X-API-Key');
  if (!apiKey || !apiKey.startsWith('sb_')) return null;

  const keyHash = createHash('sha256').update(apiKey).digest('hex');

  const record = await db.query.agentApiKeys.findFirst({
    where: eq(agentApiKeys.keyHash, keyHash),
  });

  if (!record) return null;

  // Fire-and-forget: update lastUsedAt
  db.update(agentApiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(agentApiKeys.id, record.id))
    .then(() => {})
    .catch(() => {});

  return { userId: record.userId, keyId: record.id };
}
