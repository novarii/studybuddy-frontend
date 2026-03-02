import { eq, and, desc } from 'drizzle-orm';

import { authenticateAgent } from '@/lib/agent-auth';
import { db, lectures, userLectures } from '@/lib/db';

/**
 * GET /api/agent/lectures?courseId=...
 *
 * List lectures the user has access to for a given course.
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

  const results = await db
    .select({
      id: lectures.id,
      title: lectures.title,
      durationSeconds: lectures.durationSeconds,
      status: lectures.status,
      createdAt: lectures.createdAt,
    })
    .from(lectures)
    .innerJoin(userLectures, eq(lectures.id, userLectures.lectureId))
    .where(
      and(
        eq(userLectures.userId, agentAuth.userId),
        eq(lectures.courseId, courseId)
      )
    )
    .orderBy(desc(lectures.createdAt));

  return Response.json({
    lectures: results.map((l) => ({
      id: l.id,
      title: l.title,
      durationSeconds: l.durationSeconds,
      status: l.status,
      createdAt: l.createdAt?.toISOString(),
    })),
  });
}
