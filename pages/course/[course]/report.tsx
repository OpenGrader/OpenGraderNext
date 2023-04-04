import ConsoleText from "Components/ConsoleText";
import { GetServerSidePropsContext, NextPage } from "next";
import { TestCase } from "types";
import withProtected from "util/withProtected";

interface ReportProps {
  warnings: TestCase;
  cases: TestCase[];
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) =>
  withProtected(ctx, async (ctx) => {
    const warnings: TestCase = {
      details: "Instructor settings",
      output: "WHITESPACE_WARN Improper white space",
      results: -5,
    };

    const cases: Array<TestCase> = [
      {
        details: "Binary Sort",
        output: "[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]",
        correct: "[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]",
      },
      {
        details: "Insertion Sort",
        output: "[1, 2, 3, 4, 5, 6, 7, 8, 10, 9]",
        correct: "[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]",
        errors: "Does not match",
        results: -10,
      },
    ];

    return {
      props: {
        warnings,
        cases,
      },
    };
  });

const CodeBlock = ({ header, text }: { header: string; text: string }) => {
  return (
    <div>
      <h1>{text}</h1>
      <ConsoleText text={text} />
    </div>
  );
};

const ReportBlock = ({
  details: details,
  correct: correct,
  output: output,
  errors: errors,
  results: results,
}: TestCase) => {
  return (
    <div className="bg-gray-800 w-full p-4 rounded-md flex flex-col gap-4">
      <h1 className="text-2xl font-bold">
        Case: <span className="underline">{details}</span>
      </h1>
      {correct && (
        <>
          <h2 className="text-xl">Expected</h2>
          <ConsoleText text={correct} />
        </>
      )}
      <h2 className="text-xl">Output</h2>
      <ConsoleText text={output} />
      <p>
        Results: <span>{results ? <>Points deducted {results}</> : <>No points deducted</>}</span>
      </p>
    </div>
  );
};

const GradeReport: NextPage<ReportProps> = ({ warnings, cases }) => {
  return (
    <div className="flex">
      <div className="text-gray-100 px-12 pt-6 flex flex-col gap-4 min-h-screen w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Assignment 1 Grade Report - KDE0091</h1>
        </div>
        <div className="flex flex-col gap-6 overflow-auto">
          <ReportBlock {...warnings} />
          {cases.map((item, index) => {
            return <ReportBlock {...item} key={index} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default GradeReport;
