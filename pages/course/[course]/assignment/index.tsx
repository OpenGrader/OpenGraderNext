import Link from "next/link";
import { Assignment } from "../../../../types";
import { HiPlusCircle } from "react-icons/hi";
import { GetServerSidePropsContext, NextPage } from "next";
import withProtected from "../../../../util/withProtected";
import { queryParamToNumber } from "../../../../util/misc";
import Sidebar from "../../../../Components/Sidebar";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
//warning,all good, late, plagarism

interface AssignmentListProps {
  assignments: Assignment[];
  course: {
    id: number;
    department: string;
    number: string;
  };
  section: {
    number: string;
    instructor: string;
  };
}

type ReturnedSubmission = {
  id: number;
  flags: string[];
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) =>
  withProtected(ctx, async (ctx) => {
    const supabase = createServerSupabaseClient(ctx);
    const sectionId = queryParamToNumber(ctx.query?.course);
    const { error, data } = await supabase
      .from("assignment")
      .select(
        "id, title, description, is_open, is_late, section ( course ( id, department, number ), section_number, id ), submission ( id, flags )",
      )
      .filter("section", "eq", sectionId)
      .order("created_at", { ascending: false });

    console.error(error);

    const assignments = data?.map((d) => {
      const submission = d.submission as ReturnedSubmission[] | null;
      return {
        ...d,
        submissionCount: submission?.length,
        warnings: submission?.filter((v) => v.flags?.length > 0).length,
      };
    });

    return {
      props: {
        course: {
          id: sectionId,
          department: "CSCE",
          number: "4110",
        },
        section: {
          number: "001",
          instructor: "Jason Borne",
        },
        assignments,
      },
    };
  });

const AssignmentBlock: React.FC<Assignment> = (assignment) => {
  const { title, submissionCount, warnings, id } = assignment;
  const router = useRouter();

  return (
    <div className="bg-slate-800 w-full p-3 rounded-md">
      <div className="flex justify-between">
        <div className="flex flex-col gap-4">
          <div className="">
            <div className="text-xl flex gap-2 items-center">
              <p className="text-xl font-bold">{title}</p>
            </div>
            <p>
              {submissionCount} submission{submissionCount === 1 ? "" : "s"}
            </p>
          </div>
          {warnings === 0 ? (
            <h1>No issues</h1>
          ) : (
            <h1 className="text-red-600">
              {warnings} submission{warnings === 1 ? "" : "s"} need attention
            </h1>
          )}
        </div>
        <h1 className="text-slate-400">
          <Link href={`${router.asPath}/${id}`}>View</Link> | Edit | <span className="text-red-900">Delete</span>
        </h1>
      </div>
    </div>
  );
};

const Assignments: NextPage<AssignmentListProps> = ({ assignments, course, section }) => {
  const courseName = `${course.department} ${course.number}.${section.number}`;

  return (
    <div className="flex">
      <Sidebar />
      <div className="text-slate-100 px-12 pt-6 flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Assignments - {courseName}</h1>
          <Link href={"#"} className="">
            <div className=" w-48 h-12 flex justify-center items-center rounded-lg bg-sky-700 text-3xl">
              <HiPlusCircle />
            </div>
          </Link>
        </div>
        <div className="flex flex-col gap-6">
          {assignments.map((assignment, index) => {
            return <AssignmentBlock {...assignment} key={index} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Assignments;
