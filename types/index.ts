export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
};

export type MaterialType = "pdf" | "video";

export type Material = {
  id: string;
  name: string;
  file: File;
  courseId: string;
  type: MaterialType;
};

// Matches backend CourseResponse schema
export type Course = {
  id: string;
  code: string;
  title: string;
  instructor: string | null;
};

// Document from backend
export type Document = {
  id: string;
  course_id: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  page_count: number | null;
  status: "uploaded" | "failed";
  created_at: string;
  updated_at: string;
};

export type ColorScheme = {
  background: string;
  panel: string;
  card: string;
  border: string;
  primaryText: string;
  secondaryText: string;
  accent: string;
  accentHover: string;
  hover: string;
  selected: string;
  buttonIcon: string;
};
