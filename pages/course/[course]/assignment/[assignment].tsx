import { GetServerSidePropsContext, NextPage } from "next";
import Sidebar from "../../../../Components/Sidebar";
import withProtected from "../../../../util/withProtected";
import { queryParamToNumber } from "../../../../util/misc";

interface AssignmentProps {
  id: number;
  courseId: number;
}

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withProtected(ctx, async () => {
    const assignmentId = queryParamToNumber(ctx.query?.assignment);
    const courseId = queryParamToNumber(ctx.query?.course);

    return {
      props: {
        id: assignmentId,
        courseId,
      },
    };
  });

const AssignmentView: NextPage<AssignmentProps> = ({ id, courseId }) => {
  return (
    <div className="flex">
      <Sidebar />
      <h1 className="font-bold text-3xl text-slate-50">Homepage</h1>
    </div>
  );
};

export default AssignmentView;
