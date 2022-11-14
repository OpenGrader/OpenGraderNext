import { alerts, AlertType, student } from "../../../types";
import SubmissionIcon from "./SubmissionIcon";
//warning,all good, late, plagarism

const courseData = { courseName: "CSCE 4110.001" };

const studentData = [
  {
    Name: "Jackson Welsh",
    ID: "jcw0351",
    Grade: 94,
    SubmissionCount: 16,
    Alerts: { Missing: 0, Plagiarism: 0, Errors: 0 },
  },
  {
    Name: "Dayton Forehand",
    ID: "dcf0085",
    Grade: 61,
    SubmissionCount: 12,
    Alerts: { Missing: 4, Plagiarism: 0, Errors: 0 },
  },
  {
    Name: "Kobe Edmond",
    ID: "kde0091",
    Grade: 100,
    SubmissionCount: 16,
    Alerts: { Missing: 0, Plagiarism: 1, Errors: 0 },
  },
  {
    Name: "Dayton Forehand",
    ID: "dcf0085",
    Grade: 91,
    SubmissionCount: 15,
    Alerts: { Missing: 0, Plagiarism: 0, Errors: 1 },
  },
  {
    Name: "Julaian Garcia Hernandez",
    ID: "jgh0011",
    Grade: 85,
    SubmissionCount: 15,
    Alerts: { Missing: 1, Plagiarism: 1, Errors: 1 },
  },
];

const Warnings = ({ Alerts }: { Alerts: alerts }) => {
  const { Missing, Plagiarism: Plagarism, Errors } = Alerts;

  if (Missing == 0 && Plagarism == 0 && Errors == 0) {
    return <SubmissionIcon count={0} />;
  }

  return (
    <div className="text-lg flex gap-1">
      <SubmissionIcon alertType={AlertType.MISSING} count={Alerts.Missing} />
      <SubmissionIcon alertType={AlertType.ERROR} count={Alerts.Errors} />
      <SubmissionIcon alertType={AlertType.PLAGIARISM} count={Alerts.Plagiarism} />
    </div>
  );
};

const StudentBlock = ({ data }: { data: student }) => {
  const { Name, ID, Grade, SubmissionCount, Alerts } = data;
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

const Students = () => {
  const { courseName } = courseData;
  return (
    <div className="text-slate-100 px-12 pt-6 flex flex-col gap-4 h-screen">
      <h1 className="text-3xl font-bold">Students - {courseName}</h1>
      <div className="flex flex-col gap-6 overflow-auto">
        {studentData.map((student, index) => {
          return <StudentBlock data={student} key={index} />;
        })}
      </div>
    </div>
  );
};

export default Students;
