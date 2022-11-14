import Link from "next/link";
import { assignment } from "../../types";
import { HiPlusCircle, HiPlusSm } from "react-icons/hi";
//warning,all good, late, plagarism

const courseData = { courseName: "CSCE 4110.001" };

const assignmentDate = [
  {
    Name: "Assignment 1",
    SubmissionCount: 16,
    Warnings: 0,
  },
  {
    Name: "Assignment 2",
    SubmissionCount: 12,
    Warnings: 2,
  },
  {
    Name: "Assignment 3",
    SubmissionCount: 20,
    Warnings: 0,
  },
];

const AssignemntBlock = ({ data }: { data: assignment }) => {
  const { Name, SubmissionCount, Warnings } = data;
  return (
    <div className="bg-slate-800 w-full p-3 rounded-md">
      <div className="flex justify-between">
        <div className="flex flex-col gap-4">
          <div className="">
            <div className="text-xl flex gap-2 items-center">
              <p className="text-xl font-bold">{Name}</p>
            </div>
            <p>{SubmissionCount} submissions</p>
          </div>
          {Warnings == 0 ? <h1>No issues</h1> : <h1 className="text-red-600">{Warnings} submission need attention</h1>}
        </div>
        <h1 className="text-slate-400">
          View | Edit | <span className="text-red-900">Delete</span>
        </h1>
      </div>
    </div>
  );
};

const Assignments = () => {
  const { courseName } = courseData;
  return (
    <div className="text-slate-100 px-12 pt-6 flex flex-col gap-4 ">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Assignments - {courseName}</h1>
        <Link href={"#"} className="">
          <div className=" w-48 h-12 flex justify-center items-center rounded-lg bg-sky-700 text-3xl">
            <HiPlusCircle />
          </div>
        </Link>
      </div>
      <div className="flex flex-col gap-6">
        {assignmentDate.map((assignment, index) => {
          return <AssignemntBlock data={assignment} key={index} />;
        })}
      </div>
    </div>
  );
};

export default Assignments;
