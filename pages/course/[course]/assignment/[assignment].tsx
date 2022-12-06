import { GetServerSidePropsContext, NextPage } from "next";
import Sidebar from "../../../../Components/Sidebar";
import withProtected from "../../../../util/withProtected";
import { queryParamToNumber } from "../../../../util/misc";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Student, Assignment } from "types";

type Submission = {
  id: string;
  is_late: boolean;
  score: number | null;
  flags: string[] | null;
  student: Student;
};

type AssignmentT = Assignment & { submission: Submission[] };

interface AssignmentProps {
  id: number;
  courseId: number;
  assignment: AssignmentT;
}

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withProtected(ctx, async () => {
    const assignmentId = queryParamToNumber(ctx.query?.assignment);
    const courseId = queryParamToNumber(ctx.query?.course);

    const supabase = createServerSupabaseClient(ctx);
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

    console.log(JSON.stringify(assignmentData.data ?? "{}"));

    return {
      props: {
        id: assignmentId,
        courseId,
        assignment: assignmentData.data,
      },
    };
  });

const flagClass = (flag: string): string => {
  switch (flag) {
    case "ERROR":
      return "rounded bg-red-800 text-red-50 px-2.5 py-0.5 text-sm font-semibold";
    case "PLAGIARISM":
      return "rounded bg-orange-800 text-orange-50 px-2.5 py-0.5 text-sm font-semibold";
    case "MISSING":
      return "rounded bg-pink-800 text-pink-50 px-2.5 py-0.5 text-sm font-semibold";
  }
  return "rounded bg-cyan-800 text-cyan-50 px-2.5 py-0.5 text-sm font-semibold";
};

const SubmissionCard: React.FC<Submission> = (submission) => {
  return (
    <div className="divide-y divide-gray-600 overflow-hidden rounded-lg bg-slate-800 shadow w-full">
      <div className="px-4 py-5 sm:px-6 text-xl flex items-center gap-4">
        {submission.student.given_name} {submission.student.family_name}{" "}
        {submission.is_late && (
          <span className="rounded bg-red-800 text-red-50 px-2.5 py-0.5 text-xs font-semibold">Late</span>
        )}
      </div>
      <div className="px-4 py-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <div className="font-bold">Score</div>
          <div className="my-1">{submission.score ? submission.score : "Ungraded"}</div>
        </div>
        <div>
          <div className="font-bold">Flags</div>
          <div className="flex gap-2 flex-wrap my-1">
            {submission.flags
              ? submission.flags.map((flag) => <span className={flagClass(flag)}>{flag}</span>)
              : "No flags"}
          </div>
        </div>
      </div>
    </div>
  );
};

const AssignmentView: NextPage<AssignmentProps> = ({ assignment }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="text-slate-100 px-12 pt-6 flex flex-col gap-4 w-full">
        <h1 className="font-bold text-3xl text-slate-50">Assignment: {assignment.title}</h1>
        <p>{assignment.description}</p>
        <h2 className="font-semibold text-2xl text-slate-50">Submissions</h2>
        {assignment.submission.map(SubmissionCard)}
      </div>
    </div>
  );
};

export default AssignmentView;
