export type alerts = {
  Missing: number;
  Plagiarism: number;
  Errors: number;
};

export type student = {
  Name: string;
  ID: string;
  Grade: number;
  SubmissionCount: number;
  Alerts: alerts;
};

export enum AlertType {
  MISSING,
  PLAGIARISM,
  ERROR,
}
