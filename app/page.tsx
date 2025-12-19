import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // For now, show a simple welcome page
  // This will be replaced with the main StudyBuddy UI
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to StudyBuddy</h1>
        <p className="text-muted-foreground mb-8">
          Your AI-powered study assistant
        </p>
        <p className="text-sm text-muted-foreground">
          The main application UI will be built in Phase 3.
        </p>
      </div>
    </main>
  );
}
