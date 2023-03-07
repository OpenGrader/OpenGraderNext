import { Alerts, AlertType, User } from "types";
import SubmissionIcon from "Components/SubmissionIcon";
import { GetServerSidePropsContext, NextPage } from "next";
import withProtected from "util/withProtected";
import { getCurrentUser, queryParamToNumber } from "util/misc";
import Sidebar from "Components/Sidebar";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

interface StudentsProps {
  students: (User & { membership: { id: number; role: "STUDENT" | "INSTRUCTOR" }[] })[];
  section: {
    id: number;
    course: {
      id: number;
      department: string;
      number: string;
    };
    section_number: string;
  };
  isInstructor: boolean;
}

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withProtected(ctx, async (ctx) => {
    const courseId = queryParamToNumber(ctx.query?.course);
    const supabase = createServerSupabaseClient(ctx);

    const { data: course } = await supabase
      .from("section")
      .select("id, section_number, course ( id, department, number )")
      .filter("id", "eq", courseId)
      .single();

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
      .select("id, given_name, family_name, euid, section ( id ), membership ( id, role ), submission (id, score)")
      .eq("section.id", courseId)
      .eq("membership.section", courseId)
      .order("family_name, given_name")
      .then(({ data, error }) => {
        if (error) console.error(error);
        return data?.map((d) => {
          if (isInstructor)
            return {
              ...d,
              name: d.given_name + " " + d.family_name,
              submissionCount: Array.isArray(d.submission) ? d.submission.length : d.submission ? 1 : 0,
              alerts: {
                errors: 0,
                plagiarism: 0,
                missing: 0,
              },
              grade: Array.isArray(d.submission)
                ? d.submission.reduce<number>((prev, { score }, idx) => {
                    if (Array.isArray(d.submission) && idx === d.submission.length - 1) {
                      return (prev + score) / d.submission.length;
                    }
                    return prev + score;
                  }, 0)
                : 0,
              canCreateClass: false,
              auth_id: "",
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
            role: Array.isArray(d.membership)
              ? d.membership.some(({ role }) => role === "INSTRUCTOR")
                ? "INSTRUCTOR"
                : "STUDENT"
              : d.membership?.role ?? "STUDENT",
          };
        });
      });

    console.log({ course });

    return {
      props: {
        students,
        section: course,
        isInstructor,
      },
    };
  });

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

const UserBlock: React.FC<{
  user: User & { membership: { id: number; role: "STUDENT" | "INSTRUCTOR" }[] };
  isInstructor: boolean;
}> = ({ user, isInstructor }) => {
  const showStudentDetails = isInstructor && user.membership.some(({ role }) => role === "STUDENT");
  return (
    <div className="bg-slate-800 w-full p-3 rounded-md">
      <div className="flex justify-between">
        <div className="flex flex-col gap-4">
          <div className="">
            <div className="text-xl flex gap-2 items-center">
              <p className="text-xl font-bold">{user.name}</p>
              {user.euid && <p className="">({user.euid})</p>}
              {showStudentDetails && <Warnings Alerts={user.alerts} />}
            </div>
            {showStudentDetails && <p>{user.submissionCount} submissions</p>}
          </div>
          {showStudentDetails && <h1>Current Grade: {parseFloat(user.grade.toFixed(2))}%</h1>}
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

const People: NextPage<StudentsProps> = ({ students, section, isInstructor }) => {
  console.log(students);
  return (
    <div className="flex">
      <Sidebar />
      <div className="text-slate-100 px-12 pt-6 flex flex-col gap-4 h-screen w-10/12 ml-auto">
        <h1 className="text-3xl font-bold">
          People - {section.course.department} {section.course.number}.{section.section_number}
        </h1>
        <h2 className="mt-6 text-xl font-semibold">Instructors</h2>
        {students
          .filter(({ membership }) => membership.some(({ role }) => role === "INSTRUCTOR"))
          .map((instructor, index) => {
            return <UserBlock user={instructor} isInstructor={isInstructor} key={index} />;
          })}
        <h2 className="mt-6 text-xl font-semibold">Students</h2>

        <div className="flex flex-col gap-6 overflow-auto">
          {students
            .filter(({ membership }) => membership.some(({ role }) => role === "STUDENT"))
            .map((student, index) => {
              return <UserBlock user={student} isInstructor={isInstructor} key={index} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default People;
