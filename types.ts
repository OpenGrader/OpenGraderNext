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
