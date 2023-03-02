import { Alerts, AlertType, User } from "types";
import SubmissionIcon from "Components/SubmissionIcon";
import { GetServerSidePropsContext, NextPage } from "next";
import withProtected from "util/withProtected";
import { getCurrentUser, queryParamToNumber } from "util/misc";
import Sidebar from "Components/Sidebar";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

//warning,all good, late, plagarism

interface StudentsProps {
  students: User[];
  course: { id: number; department: string; number: string };
  isInstructor: boolean;
}

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withProtected(ctx, async (ctx) => {
    const courseId = queryParamToNumber(ctx.query?.course);
    const supabase = createServerSupabaseClient(ctx);

    const { data: course } = await supabase
      .from("section")
      .select("id, section_number, course ( id, department, number )")
      .filter("id", "eq", courseId);

    const currentUser = await getCurrentUser(supabase);
    const { data: currentUserMembership } = await supabase
      .from("membership")
      .select("role")
      .eq("section", courseId)
      .eq("user", currentUser?.id)
      .single();

    if (!currentUserMembership) {
      return {
        redirect: {
          destination: "/course",
          permanent: false,
        },
      };
    }

    const isInstructor = currentUserMembership.role === "INSTRUCTOR";

    const students = await supabase
      .from("user")
      .select("id, given_name, family_name, euid, section ( id ), membership ( id, role )")
      .eq("section.id", courseId)
      .order("family_name, given_name")
      .then(({ data, error }) => {
        console.error(error);
        return data
          ?.filter(
            (d) => (d.membership as any[])?.map((m) => m.role).includes("STUDENT") && (d.section as any[]).length > 0,
          ) // hack to only include students
          .map((d) => {
            if (isInstructor)
              return {
                ...d,
                name: d.given_name + " " + d.family_name,
                submissionCount: Math.floor(Math.random() * 12),
                alerts: {
                  errors: Math.floor(Math.random() * 3),
                  plagiarism: Math.floor(Math.random() * 2),
                  missing: Math.floor(Math.random() * 4),
                },
                grade: Math.floor(Math.random() * 40 + 60),
                canCreateClass: false,
              } as User;

            return {
              ...d,
              name: d.given_name + " " + d.family_name,
              submissionCount: -1,
              alerts: {
                errors: -1,
                plagiarism: -1,
                missing: -1,
              },
              grade: -1,
              canCreateClass: false,
            };
          });
      });

    return {
      props: {
        students,
        course,
        isInstructor,
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

const StudentBlock: React.FC<{ student: User; isInstructor: boolean }> = ({ student, isInstructor }) => {
  return (
    <div className="bg-slate-800 w-full p-3 rounded-md">
      <div className="flex justify-between">
        <div className="flex flex-col gap-4">
          <div className="">
            <div className="text-xl flex gap-2 items-center">
              <p className="text-xl font-bold">{student.name}</p>
              <p className="">({student.euid})</p>
              {isInstructor && <Warnings Alerts={student.alerts} />}
            </div>
            {isInstructor && <p>{student.submissionCount} submissions</p>}
          </div>
          {isInstructor && <h1>Current Grade: {student.grade}%</h1>}
        </div>
        {isInstructor && (
          <h1 className="text-slate-400">
            View | Edit | <span className="text-red-900">Delete</span>
          </h1>
        )}
      </div>
    </div>
  );
};
{
  /* <p className="text-slate-300">{SubmissionCount} submissions</p> */
}

const Students: NextPage<StudentsProps> = ({ students, course, isInstructor }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="text-slate-100 px-12 pt-6 flex flex-col gap-4 h-screen w-10/12 ml-auto">
        <h1 className="text-3xl font-bold">
          Students - {course.department} {course.number}
        </h1>
        <div className="flex flex-col gap-6 overflow-auto">
          {students.map((student, index) => {
            return <StudentBlock student={student} isInstructor={isInstructor} key={index} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Students;
