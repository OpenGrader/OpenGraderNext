export type alerts = {
  Missing: number;
  Plagarism: number;
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
