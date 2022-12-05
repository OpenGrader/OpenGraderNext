import Link from "next/link";
import { assignment } from "../../../../types";
import { HiPlusCircle } from "react-icons/hi";
import { GetServerSidePropsContext, NextPage } from "next";
import withProtected from "../../../../util/withProtected";
import { queryParamToNumber } from "../../../../util/misc";
import Sidebar from "../../../../Components/Sidebar";
//warning,all good, late, plagarism

type Assignment = {
  name: string;
  submissionCount: number;
  warnings: number;
};

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

export const getServerSideProps = async (ctx: GetServerSidePropsContext) =>
  withProtected(ctx, async (ctx) => {
    const courseId = queryParamToNumber(ctx.query?.course);
    const assignments = [
      {
        name: "Assignment 1",
        submissionCount: 16,
        warnings: 0,
      },
      {
        name: "Assignment 2",
        submissionCount: 12,
        warnings: 2,
      },
      {
        name: "Assignment 3",
        submissionCount: 20,
        warnings: 0,
      },
    ];

    return {
      props: {
        course: {
          id: courseId,
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

const AssignmentBlock = ({ data }: { data: Assignment }) => {
  const { name, submissionCount, warnings } = data;
  return (
    <div className="bg-slate-800 w-full p-3 rounded-md">
      <div className="flex justify-between">
        <div className="flex flex-col gap-4">
          <div className="">
            <div className="text-xl flex gap-2 items-center">
              <p className="text-xl font-bold">{name}</p>
            </div>
            <p>{submissionCount} submissions</p>
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
          View | Edit | <span className="text-red-900">Delete</span>
        </h1>
      </div>
    </div>
  );
};

const Assignments: NextPage<AssignmentListProps> = ({ assignments, course, section }) => {
  const courseName = `${course.department} ${course.number}.${section.number}`;
  const pageData = { parent: "Homepage", courseID: course.id.toString() };
  return (
    <div className="flex">
      <Sidebar />
      <div className="text-slate-100 px-12 pt-6 flex flex-col gap-4 w-full ">
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
            return <AssignmentBlock data={assignment} key={index} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Assignments;
