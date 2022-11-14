export type alerts = {
  Missing: number;
  Plagarism: number;
  Errors: number;
};

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
