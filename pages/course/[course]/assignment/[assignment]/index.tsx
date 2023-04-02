import { GetServerSidePropsContext, NextPage } from "next";
import Badge, { BadgeVariant } from "Components/Badge";
import withProtected from "../../../../../util/withProtected";
import { queryParamToNumber } from "../../../../../util/misc";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { User, Assignment } from "types";
import Button from "Components/Button";

type Submission = {
  id: string;
  is_late: boolean;
  score: number | null;
  flags: string[] | null;
  student: User;
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

    return {
      props: {
        id: assignmentId,
        courseId,
        assignment: assignmentData.data,
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

const SubmissionCard: React.FC<Submission> = (submission) => {
  let studentDesc: string;
  if (submission.student.given_name || submission.student.family_name) {
    studentDesc = `${submission.student.given_name} ${submission.student.family_name}`;
  } else {
    studentDesc = submission.student.euid;
  }

  return (
    <div className="divide-y divide-gray-600 overflow-hidden rounded-lg bg-gray-800 shadow w-full">
      <div className="px-4 py-5 sm:px-6 text-xl flex items-center gap-2">
        {studentDesc} {submission.is_late && <Badge variant="red">Late</Badge>}
      </div>
      <div className="px-4 py-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <div className="font-bold">Score</div>
          <div className="my-1">{submission.score ? submission.score : "Ungraded"}</div>
        </div>
        <div>
          <div className="font-bold">Flags</div>
          <div className="flex gap-2 flex-wrap my-1">
            {submission.flags && submission.flags.length > 0
              ? submission.flags.map((flag) => <Badge variant={flagClass(flag)}>{flag}</Badge>)
              : "No flags"}
          </div>
        </div>
      </div>
    </div>
  );
};

const AssignmentView: NextPage<AssignmentProps> = ({ assignment, courseId }) => {
  return (
    <div className="flex flex-wrap">
      <div className="text-gray-100 px-12 pt-6 flex flex-col gap-4 w-full">
        <div className="grid gap-6">
          <div className="grid gap-6">
            <h1 className="font-bold text-3xl text-gray-50 flex flex-wrap items-center gap-4 w-full">
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
            <p className="max-w-[80ch]">{assignment.description}</p>
          </div>

          <Button href={`/course/${courseId}/assignment/${assignment.id}/submit`} arrow="right" className="w-min">
            <h1>Submit</h1>
          </Button>
          <h2 className="font-semibold text-2xl text-gray-50">Submissions</h2>
        </div>
        {assignment.submission.map(SubmissionCard)}
        {assignment.submission.length === 0 && <em className="text-gray-300">No submissions yet.</em>}
      </div>
    </div>
  );
};

export default AssignmentView;
