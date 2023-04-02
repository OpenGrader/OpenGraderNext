import withProtected from "../../../../../../util/withProtected";
import { queryParamToNumber } from "../../../../../../util/misc";
import { GetServerSidePropsContext, NextPage } from "next";
import Badge from "Components/Badge";
import { Assignment, StudentSubmission } from "types";
import { loadUser } from "store/userSlice";
import { getCurrentUser } from "../../../../../../util/misc";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Upload from "../../../../../../Components/UploadBox";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "hooks";
import { useRouter } from "next/router";
import Button from "Components/Button";

type AssignmentT = Assignment & { submission: StudentSubmission[] };

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

const AssignmentUpload: NextPage<AssignmentProps> = ({ id, courseId, assignment }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((store) => store.user);
  const supabase = useSupabaseClient();
  const [userId, setUserId] = useState<number | undefined>(undefined);

  useEffect(() => {
    const getUser = async () => {
      if (user.id === null) {
        await getCurrentUser(supabase).then((user) => {
          if (user) dispatch(loadUser(user));
          setUserId(user?.id);
        });
      } else {
        setUserId(user.id);
      }
      if (assignment === null) {
        router.push("/course");
      }
    };

    getUser();
  }, []);

  return (
    <div className="flex">
      {assignment !== null && (
        <div className="text-gray-100 px-12 pt-6 flex flex-col gap-4 w-full">
          <h1 className="font-bold text-3xl text-gray-50 flex flex-wrap items-center gap-4">
            Assignment: {assignment?.title}{" "}
            {assignment?.is_open ? (
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
          <p>{assignment?.description}</p>
          <div className="">
            <Upload bucket="assignments" courseID={courseId} assignmentID={id} userID={userId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentUpload;
