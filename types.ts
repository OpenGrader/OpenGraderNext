export type Alerts = {
  missing: number;
  plagiarism: number;
  errors: number;
};

export type pageData = {
  parent: string;
  courseID: string;
};

export type User = {
  name: string;
  id: number;
  given_name: string;
  family_name: string;
  euid: string;
  grade: number;
  submissionCount: number;
  alerts: Alerts;
  canCreateClass: boolean;
  auth_id: string;
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
  section: number;
  submissionCount: number;
  warnings: number;
  submission: Submission[];
};

export type StudentSubmission = {
  id: string;
  is_late: boolean;
  score: number | null;
  flags: string[] | null;
  student: User;
};

export type Submission = StudentSubmission & {
  created_at: Date;
  assignment: number;
  submission_loc: string | null;
  feedback: string | null;
};
