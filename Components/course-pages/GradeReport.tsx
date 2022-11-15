import ConsoleText from "../ConsoleText";

import { TestCase, ReportData } from "../../types";

const Warnings: TestCase = {
  Details: "Instructor settings",
  Output: "WHITESPACE_WARN Improper white space",
  Results: -5,
};

const Cases: Array<TestCase> = [
  {
    Details: "Binary Sort",
    Output: "[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]",
    Correct: "[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]",
  },
  {
    Details: "Insertion Sort",
    Output: "[1, 2, 3, 4, 5, 6, 7, 8, 10, 9]",
    Correct: "[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]",
    Errors: "Does not match",
    Results: -10,
  },
];

const CodeBlock = ({ header, text }: { header: string; text: string }) => {
  return (
    <div>
      <h1>{text}</h1>
      <ConsoleText text={text} />
    </div>
  );
};

const ReportBlock = ({ Details, Correct, Output, Errors, Results }: TestCase) => {
  return (
    <div className="bg-slate-800 w-full p-4 rounded-md flex flex-col gap-4">
      <h1 className="text-2xl font-bold">
        Case: <span className="underline">{Details}</span>
      </h1>
      {Correct && (
        <>
          <h2 className="text-xl">Expected</h2>
          <ConsoleText text={Correct} />
        </>
      )}
      <h2 className="text-xl">Output</h2>
      <ConsoleText text={Output} />
      <p>
        Results: <span>{Results ? <>Points deducted {Results}</> : <>No points deducted</>}</span>
      </p>
    </div>
  );
};

const GradeReport = () => {
  return (
    <div className="text-slate-100 px-12 pt-6 flex flex-col gap-4 h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Assignment 1 Grade Report - KDE0091</h1>
      </div>
      <div className="flex flex-col gap-6 overflow-auto">
        <ReportBlock {...Warnings} />
        {Cases.map((item, index) => {
          return <ReportBlock {...item} key={index} />;
        })}
      </div>
    </div>
  );
};

export default GradeReport;
