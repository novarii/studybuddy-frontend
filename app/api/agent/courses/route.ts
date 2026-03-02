import { authenticateAgent } from '@/lib/agent-auth';
import { db, courses, userCourses } from '@/lib/db';
import { eq, asc } from 'drizzle-orm';

/**
 * GET /api/agent/courses
 *
 * List enrolled courses for the authenticated agent user.
 * Auth: X-API-Key header with sb_-prefixed key.
 */
export async function GET(req: Request) {
  const agentAuth = await authenticateAgent(req);
  if (!agentAuth) {
    return Response.json({ error: 'Invalid or missing API key' }, { status: 401 });
  }

  const enrolledCourses = await db
    .select()
    .from(userCourses)
    .innerJoin(courses, eq(userCourses.courseId, courses.id))
    .where(eq(userCourses.userId, agentAuth.userId))
    .orderBy(asc(courses.code));

  return Response.json({
    courses: enrolledCourses.map(({ courses: course }) => ({
      id: course.id,
      code: course.code,
      title: course.title,
      instructor: course.instructor,
    })),
  });
}
