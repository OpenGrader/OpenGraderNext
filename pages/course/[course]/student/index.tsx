import { Alerts, AlertType, Student } from "types";
import SubmissionIcon from "Components/SubmissionIcon";
import { GetServerSidePropsContext, NextPage } from "next";
import withProtected from "util/withProtected";
import { queryParamToNumber } from "util/misc";
import Sidebar from "Components/Sidebar";
//warning,all good, late, plagarism

interface StudentsProps {
  students: Student[];
  course: { id: number; department: string; number: string };
}

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withProtected(ctx, async (ctx) => {
    const courseId = queryParamToNumber(ctx.query?.course);

    const course = { id: courseId, department: "CSCE", number: "4110" };

    const students: Student[] = [
      {
        name: "Jackson Welsh",
        id: "jcw0351",
        grade: 94,
        submissionCount: 16,
        alerts: { missing: 0, plagiarism: 0, errors: 0 },
      },
      {
        name: "Dayton Forehand",
        id: "dcf0085",
        grade: 61,
        submissionCount: 12,
        alerts: { missing: 4, plagiarism: 0, errors: 0 },
      },
      {
        name: "Kobe Edmond",
        id: "kde0091",
        grade: 100,
        submissionCount: 16,
        alerts: { missing: 0, plagiarism: 1, errors: 0 },
      },
      {
        name: "Dayton Forehand",
        id: "dcf0085",
        grade: 91,
        submissionCount: 15,
        alerts: { missing: 0, plagiarism: 0, errors: 1 },
      },
      {
        name: "Julaian Garcia Hernandez",
        id: "jgh0011",
        grade: 85,
        submissionCount: 15,
        alerts: { missing: 1, plagiarism: 1, errors: 1 },
      },
    ];

    return {
      props: {
        students,
        course,
      },
    };
  });

const courseData = { courseName: "CSCE 4110.001" };

const Warnings = ({ Alerts }: { Alerts: Alerts }) => {
  const { missing: Missing, plagiarism: Plagarism, errors: Errors } = Alerts;

  if (Missing == 0 && Plagarism == 0 && Errors == 0) {
    return <SubmissionIcon count={0} />;
  }

  return (
    <div className="text-lg flex gap-1">
      <SubmissionIcon alertType={AlertType.MISSING} count={Alerts.missing} />
      <SubmissionIcon alertType={AlertType.ERROR} count={Alerts.errors} />
      <SubmissionIcon alertType={AlertType.PLAGIARISM} count={Alerts.plagiarism} />
    </div>
  );
};

const StudentBlock = ({ data }: { data: Student }) => {
  const { name: Name, id: ID, grade: Grade, submissionCount: SubmissionCount, alerts: Alerts } = data;
  return (
    <div className="bg-slate-800 w-full p-3 rounded-md">
      <div className="flex justify-between">
        <div className="flex flex-col gap-4">
          <div className="">
            <div className="text-xl flex gap-2 items-center">
              <p className="text-xl font-bold">{Name}</p>
              <p className="">({ID})</p>
              <Warnings Alerts={Alerts} />
            </div>
            <p>{SubmissionCount} submissions</p>
          </div>
          <h1>Current Grade: {Grade}%</h1>
        </div>
        <h1 className="text-slate-400">
          View | Edit | <span className="text-red-900">Delete</span>
        </h1>
      </div>
    </div>
  );
};
{
  /* <p className="text-slate-300">{SubmissionCount} submissions</p> */
}

const Students: NextPage<StudentsProps> = ({ students, course }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="text-slate-100 px-12 pt-6 flex flex-col gap-4 h-screen w-full">
        <h1 className="text-3xl font-bold">
          Students - {course.department} {course.number}
        </h1>
        <div className="flex flex-col gap-6 overflow-auto">
          {students.map((student, index) => {
            return <StudentBlock data={student} key={index} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Students;
