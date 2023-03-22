import { GetServerSidePropsContext, NextPage } from "next";
import { useState } from "react";
import Sidebar from "../../../../../Components/Sidebar";
import Badge, { BadgeVariant } from "Components/Badge";
import withProtected from "../../../../../util/withProtected";
import { queryParamToNumber } from "../../../../../util/misc";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { User, Assignment } from "types";
import Link from "next/link";
import { supabaseAdmin } from "util/supabaseClient";
import CodeBrowser from "Components/CodeBrowser";

type Submission = {
  id: string;
  is_late: boolean;
  score: number | null;
  flags: string[] | null;
  student: User;
  file: string;
};

type AssignmentT = Assignment & { submission: Submission[] };

interface AssignmentProps {
  id: number;
  courseId: number;
  assignment: AssignmentT;
  file: string;
}

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withProtected(ctx, async () => {
    const assignmentId = queryParamToNumber(ctx.query?.assignment);
    const courseId = queryParamToNumber(ctx.query?.course);

    const supabase = createServerSupabaseClient(ctx);

    let blob;
    let code;
    blob = await supabaseAdmin.storage.from("assignments").download(`8/5_hw1.py`); //hardcoded; going to fix ASAP;

    if (blob?.data != null) {
      code = await blob.data.text();
    }

    const assignmentData = await supabase
      .from("assignment")
      .select(
        `
        id,
        title,
        description,
        is_open,
        is_late, 
        submission (
          id,
          is_late,
          score,
          flags,
          student (
            id,
            euid,
            given_name,
            family_name
          )
        )
        `,
      )
      .eq("id", assignmentId)
      .order("created_at", { foreignTable: "submission", ascending: false })
      .single();

    return {
      props: {
        id: assignmentId,
        courseId,
        assignment: assignmentData.data,
        file: code,
      },
    };
  });

const flagClass = (flag: string): BadgeVariant => {
  switch (flag) {
    case "ERROR":
      return "red";
    case "PLAGIARISM":
      return "orange";
    case "MISSING":
      return "pink";
    default:
      return "cyan";
  }
};

const SubmissionCard: React.FC<Submission & { file: string}> = ({id, is_late, score, flags, student, file}) => {
  const [isSubmissionCardClicked, setIsSubmissionCardClicked] = useState(false);
  const handleSubmissionCardClick = () => {
    setIsSubmissionCardClicked((prevState) => !prevState);
  };
  let studentDesc: string;
  if (student.given_name || student.family_name) {
    studentDesc = `${student.given_name} ${student.family_name}`;
  } else {
    studentDesc = student.euid;
  }

  return (
    <div onClick={handleSubmissionCardClick}>
      <div className="divide-y divide-gray-600 overflow-hidden rounded-lg bg-slate-800 shadow w-full">
        <div className="px-4 py-5 sm:px-6 text-xl flex items-center gap-2">
          {studentDesc} {is_late && <Badge variant="red">Late</Badge>}
        </div>
        <div className="px-4 py-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <div className="font-bold">Score</div>
            <div className="my-1">{score ? score : "Ungraded"}</div>
          </div>
          <div>
            <div className="font-bold">Flags</div>
            <div className="flex gap-2 flex-wrap my-1">
              {flags && flags.length > 0
                ? flags.map((flag) => <Badge variant={flagClass(flag)}>{flag}</Badge>)
                : "No flags"}
            </div>
          </div>
        </div>
        <div className="pl-6">{isSubmissionCardClicked && <CodeBrowser language="python" code={file} />}</div>
      </div>
    </div>
  );
};

const AssignmentView: NextPage<AssignmentProps> = ({ assignment, file, courseId }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="text-slate-100 px-12 pt-6 flex flex-col gap-4 w-10/12 ml-auto">
        <div className="flex justify-between items-center">
          <div className="">
            <h1 className="font-bold text-3xl text-slate-50 flex flex-wrap items-center gap-4">
              Assignment: {assignment.title}{" "}
              {assignment.is_open ? (
                <>
                  <Badge variant="green">Open</Badge>
                  {assignment.is_late ? (
                    <Badge variant="orange">New submissions are late</Badge>
                  ) : (
                    <Badge variant="cyan">Ready for submissions</Badge>
                  )}
                </>
              ) : (
                <Badge variant="red">Locked</Badge>
              )}{" "}
            </h1>
            <p>{assignment.description}</p>
            <h2 className="font-semibold text-2xl text-slate-50">Submissions</h2>
          </div>

          <Link href={`/course/${courseId}/assignment/${assignment.id}/submit`} className="">
            <div className="inline-flex items-center rounded border border-transparent bg-cyan-700 px-4 py-2 text-3xl font-medium text-cyan-50 shadow-sm hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2">
              <h1>Submit</h1>
            </div>
          </Link>
        </div>
        {assignment.submission.map((submission) => {
              if (typeof submission.student === "number") {
                return null;
              }
              return (
                submission.student && (
                  <SubmissionCard
                    id={submission.id.toString()}
                    is_late={submission.is_late}
                    score={submission.score}
                    flags={submission.flags}
                    student={submission.student}
                    file={file}
                  />
                )
              );
            })}
      </div>
    </div>
  );
};

export default AssignmentView;
