import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import PanelLink from "Components/PanelLink";
import { GetServerSidePropsContext, NextPage } from "next";
import Link from "next/link";
import { HiPlus, HiPlusCircle } from "react-icons/hi";
import { useRouter } from "next/router";
import { HiEye, HiPencil, HiX } from "react-icons/hi";
import { Assignment, Submission } from "types";
import { getCurrentUser } from "util/misc";
import withProtected from "util/withProtected";
import Button from "Components/Button";

type CourseSection = {
  section: {
    id: number;
    section_number: string;
    course: {
      department: string;
      number: string;
    };
    assignment: Assignment[];
  };
};

interface CourseListProps {
  sections: Array<CourseSection & { role: "STUDENT" | "INSTRUCTOR" }>;
  submissions: Record<number, Array<FormattedSubmissionT>>;
  isInstructor: any;
}

type FormattedSubmissionT = { formatted: string; created: Date | string };

export const getServerSideProps = async (ctx: GetServerSidePropsContext) =>
  withProtected(ctx, async (ctx) => {
    const supabase = createServerSupabaseClient(ctx);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const profile = await getCurrentUser(supabase);

    const sections = await supabase
      .from("membership")
      .select(
        `role, 
        section (
          id,
          section_number,
          course (
            department,
            number
          ),
          assignment (
            id,
            title,
            created_at,
            is_open,
            is_late,
            section,
            submission (
              id,
              created_at,
              student (
                id,
                given_name,
                family_name,
                euid
              )
            )
          )
        )`,
      )
      .eq("user", profile?.id)
      .order("created_at", { foreignTable: "section.assignment", ascending: false })
      .order("created_at", { foreignTable: "section.assignment.submission", ascending: false });
    if (sections.error) console.error(sections.error);

    // chronologically-ordered list of submissions keyed by submission id
    const allSubmissions = sections.data
      ?.map((section) => (section as unknown as CourseSection).section.assignment)
      .flat()
      .reduce<Record<number, Array<FormattedSubmissionT>>>((prev, assignment) => {
        if (assignment) {
          const submissions = assignment.submission as Array<Partial<Submission>>;
          const sectionId = assignment.section;
          if (!prev[sectionId]) {
            prev[sectionId] = [];
          }

          const formatted = submissions.map<FormattedSubmissionT>((submission) => {
            let studentDesc: string;
            if (typeof submission.student === "number") {
              studentDesc = `student ${submission.student}`;
            } else {
              if (submission.student?.given_name) {
                studentDesc = `${submission.student.given_name} ${submission.student.family_name} (${submission.student.euid})`;
              } else {
                studentDesc = `${submission.student?.euid ?? "unknown student"}`;
              }
            }
            return {
              formatted: `${assignment.title} - ${studentDesc}`,
              created: submission.created_at!,
            };
          });

          prev[sectionId] = [...prev[sectionId], ...formatted];

          // sort in newest-first order
          prev[sectionId].sort((a, b) => {
            const dA = new Date(a.created);
            const dB = new Date(b.created);

            return dB.getTime() - dA.getTime();
          });
        }
        return prev;
      }, {});
    const { data: isInstructor } = await supabase.rpc("is_instructor", { uid: user?.id });

    return {
      props: {
        sections: sections.data,
        submissions: allSubmissions,
        isInstructor,
      },
    };
  });

const makeInfoString = (assignment: Assignment): string => {
  const ret = [];
  if (assignment.is_open) {
    ret.push("open");
    if (assignment.is_late) {
      ret.push("late");
    }
  } else {
    ret.push("closed");
  }

  return `(${ret.join(", ")})`;
};

const SectionCard: React.FC<
  CourseSection["section"] & { submissions: Array<FormattedSubmissionT>; role: "STUDENT" | "INSTRUCTOR" }
> = ({ id, section_number, role, course, assignment, submissions }) => {
  const router = useRouter();

  return (
    <div className="bg-gray-800/25 border border-gray-400 w-full p-6 rounded-md">
      <div className="flex justify-between flex-wrap-reverse">
        <div className="flex flex-col gap-4">
          <div className="">
            <div className="text-xl flex gap-2 items-center">
              <Link href={`${router.asPath}/${id}/assignment`} className="text-xl font-bold hover:underline">
                {course.department} {course.number}.{section_number}
              </Link>
            </div>
          </div>
        </div>
        <h1 className="text-gray-400 mb-2 w-full sm:w-auto">
          <ul className="flex rounded-md border border-gray-400 shadow-xl w-min mx-auto">
            <PanelLink
              title="View"
              position={role === "INSTRUCTOR" ? "first" : "only"}
              href={`${router.asPath}/${id}/assignment`}>
              <HiEye />
            </PanelLink>

            {role === "INSTRUCTOR" && (
              <>
                <PanelLink title="Edit" position="other" href={`${router.asPath}/${id}/edit`}>
                  <HiPencil />
                </PanelLink>
                <PanelLink title="Delete" position="last" href={`${router.asPath}/${id}/delete`}>
                  <HiX className="text-red-500" />
                </PanelLink>
              </>
            )}
          </ul>
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <strong className="font-semibold">Recent assignments</strong>
          <ul>
            {assignment.slice(0, 3).map((a) => (
              <li key={a.id}>
                {a.title} {makeInfoString(a)}
              </li>
            ))}
          </ul>
        </div>
        {role === "INSTRUCTOR" && (
          <div>
            <strong className="font-semibold">Recent submissions</strong>
            <ul>
              {submissions.slice(0, 3).map((submission, idx) => (
                <li key={idx}>
                  <>{submission.formatted}</>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const CourseListPage: NextPage<CourseListProps> = ({ sections, submissions }) => {
  return (
    <div className="flex">
      <div className="text-gray-100 px-12 pt-6 flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center flex-wrap gap-6">
          <h1 className="text-3xl font-bold w-full">Your Courses</h1>
          <Button variant="primary" href="/course/new">
            <HiPlus /> Create course
          </Button>
          {sections?.map(({ section, role }) => (
            <SectionCard {...section} submissions={submissions[section.id] ?? []} key={section.id} role={role} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseListPage;
