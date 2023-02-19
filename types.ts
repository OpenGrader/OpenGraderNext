export type Alerts = {
  missing: number;
  plagiarism: number;
  errors: number;
};

export type pageData = {
  parent: string;
  courseID: string;
};

export type Student = {
  name: string;
  id: string;
  given_name: string;
  family_name: string;
  euid: string;
  grade: number;
  submissionCount: number;
  alerts: Alerts;
};

export type assignment = {
  Name: string;
  SubmissionCount: number;
  Warnings: number;
};

export enum AlertType {
  MISSING,
  PLAGIARISM,
  ERROR,
}

export type TestCase = {
  details: string;
  correct?: string;
  output: string;
  errors?: string;
  results?: number;
};

export type ReportData = {
  warnings: TestCase;
  cases: Array<TestCase>;
};

export type Course = {
  id: number;
  department: string;
  number: string;
};

export type Section = {
  id: number;
  section_number: string;
  course: Course;
};

export type Assignment = {
  id: number;
  title: string;
  description: string;
  is_open: boolean;
  is_late: boolean;
  section: Section;
  submissionCount: number;
  warnings: number;
  submission: Submission[];
};

export type Submission = {
  id: number;
  created_at: Date;
  assignment: number;
  student: number | Student | null;
  is_late: boolean;
  score: number;
  flags: string[] | null;
  submission_loc: string | null;
  feedback: string | null;
};
