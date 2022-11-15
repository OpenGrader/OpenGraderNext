export type alerts = {
  Missing: number;
  Plagiarism: number;
  Errors: number;
};

export type pageData = {
  parent: string;
  courseID: string;
}

export type student = {
  Name: string;
  ID: string;
  Grade: number;
  SubmissionCount: number;
  Alerts: alerts;
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

export type TestCase ={
  Output: string;
  Results: number;
}

export type GradeReport = {
  CaseName: string;
  Cases: Array<TestCase>;
}
