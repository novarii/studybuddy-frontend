import { eq, and, desc } from 'drizzle-orm';

import { authenticateAgent } from '@/lib/agent-auth';
import { db, documents } from '@/lib/db';

/**
 * GET /api/agent/documents?courseId=...
 *
 * List documents (PDFs/slides) the user owns for a given course.
 * Auth: X-API-Key header.
 */
export async function GET(req: Request) {
  const agentAuth = await authenticateAgent(req);
  if (!agentAuth) {
    return Response.json({ error: 'Invalid or missing API key' }, { status: 401 });
  }

  const url = new URL(req.url);
  const courseId = url.searchParams.get('courseId');

  if (!courseId) {
    return Response.json({ error: 'courseId is required' }, { status: 400 });
  }

  const docs = await db.query.documents.findMany({
    where: and(
      eq(documents.userId, agentAuth.userId),
      eq(documents.courseId, courseId)
    ),
    orderBy: [desc(documents.createdAt)],
  });

  return Response.json({
    documents: docs.map((doc) => ({
      id: doc.id,
      filename: doc.filename,
      pageCount: doc.pageCount,
      status: doc.status,
      createdAt: doc.createdAt.toISOString(),
    })),
  });
}
