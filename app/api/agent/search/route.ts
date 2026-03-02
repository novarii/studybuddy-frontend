import { eq, and, inArray } from 'drizzle-orm';

import { authenticateAgent } from '@/lib/agent-auth';
import { searchKnowledge, formatTimestamp } from '@/lib/ai';
import { getUserApiKey } from '@/lib/api-keys';
import { db, userCourses, lectures } from '@/lib/db';

/**
 * POST /api/agent/search
 *
 * Search course materials (lectures + slides) via vector similarity.
 * Returns lean results with full chunk text, source labels, and Panopto links.
 *
 * Auth: X-API-Key header with sb_-prefixed key.
 * Body: { courseId: string, query: string, lectureId?: string, documentId?: string }
 */
export async function POST(req: Request) {
  const agentAuth = await authenticateAgent(req);
  if (!agentAuth) {
    return Response.json(
      { error: 'Invalid or missing API key' },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { courseId, query, documentId, lectureId } = body;

  if (!courseId || !query) {
    return Response.json(
      { error: 'courseId and query are required' },
      { status: 400 }
    );
  }

  // Verify the user is enrolled in this course
  const enrollment = await db.query.userCourses.findFirst({
    where: and(
      eq(userCourses.userId, agentAuth.userId),
      eq(userCourses.courseId, courseId)
    ),
  });

  if (!enrollment) {
    return Response.json(
      { error: 'Not enrolled in this course' },
      { status: 403 }
    );
  }

  // Get embedding API key (user's BYOK or system fallback)
  const apiKey = await getUserApiKey(agentAuth.userId);

  const { rawResults } = await searchKnowledge({
    query,
    userId: agentAuth.userId,
    courseId,
    documentId,
    lectureId,
    apiKey,
  });

  if (!rawResults || rawResults.length === 0) {
    return Response.json({ results: [] });
  }

  // Batch-fetch Panopto URLs for lecture results
  const lectureIds = [
    ...new Set(
      rawResults
        .filter((r) => r.type === 'lecture')
        .map((r) => (r as Extract<typeof r, { type: 'lecture' }>).lectureId)
    ),
  ];

  const lectureMap = new Map<string, string>();
  if (lectureIds.length > 0) {
    const lectureRecords = await db
      .select({ id: lectures.id, panoptoUrl: lectures.panoptoUrl })
      .from(lectures)
      .where(inArray(lectures.id, lectureIds));

    for (const lec of lectureRecords) {
      if (lec.panoptoUrl) {
        lectureMap.set(lec.id, lec.panoptoUrl);
      }
    }
  }

  // Build lean results with full content
  const results = rawResults.map((result) => {
    if (result.type === 'lecture') {
      const timestamp = formatTimestamp(result.startSeconds);
      const panoptoUrl = lectureMap.get(result.lectureId);

      // Construct timestamped Panopto link
      let link: string | undefined;
      if (panoptoUrl) {
        const url = new URL(panoptoUrl);
        url.searchParams.set('start', String(Math.floor(result.startSeconds)));
        link = url.toString();
      }

      return {
        content: result.content,
        source: `${result.title ?? 'Lecture'} @ ${timestamp}`,
        type: 'lecture' as const,
        ...(link && { link }),
      };
    }

    // Slide source
    return {
      content: result.content,
      source: `${result.title ?? 'Document'} - Slide ${result.slideNumber}`,
      type: 'slide' as const,
    };
  });

  return Response.json({ results });
}
