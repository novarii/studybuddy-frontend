import { auth } from '@clerk/nextjs/server';
import { eq, and } from 'drizzle-orm';

import { db, agentApiKeys } from '@/lib/db';

type RouteParams = { params: Promise<{ id: string }> };

/**
 * DELETE /api/user/agent-keys/[id]
 *
 * Revoke an agent API key.
 */
export async function DELETE(req: Request, { params }: RouteParams) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  await db
    .delete(agentApiKeys)
    .where(and(eq(agentApiKeys.id, id), eq(agentApiKeys.userId, userId)));

  return new Response(null, { status: 204 });
}
