import withProtected from "../../../../../../util/withProtected";
import { queryParamToNumber } from "../../../../../../util/misc";
import { GetServerSidePropsContext, NextPage } from "next";
import Badge,{BadgeVariant} from "Components/Badge";
import Sidebar from "Components/Sidebar";
import { User, Assignment } from "types";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Upload from "../../../../../../Components/UploadBox"

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

const AssignmentUpload: NextPage<AssignmentProps> = ({ id, courseId, assignment }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="text-slate-100 px-12 pt-6 flex flex-col gap-4 w-10/12 ml-auto">
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
        <div className="">
          <Upload bucket="assignments" path={`${courseId}/${id}/`} url={`course/${courseId}/assignment/${id}/`} />
        </div>
      </div>
    </div>
  );
};

export default AssignmentUpload;
