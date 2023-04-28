import Link from "next/link";
import { Assignment } from "../../../../types";
import { HiEye, HiPencil, HiPlus, HiPlusCircle, HiX } from "react-icons/hi";
import { GetServerSidePropsContext, NextPage } from "next";
import withProtected from "../../../../util/withProtected";
import { getCurrentUser, queryParamToNumber } from "../../../../util/misc";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import Button from "Components/Button";
import PanelLink from "Components/PanelLink";
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
  isInstructor: boolean;
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
      .select("id, title, description, is_open, is_late, submission ( id, flags )")
      .filter("section", "eq", sectionId)
      .order("created_at", { ascending: false });

    const { data: sectionInfo } = await supabase
      .from("section")
      .select("id, section_number, course ( id, department, number )")
      .eq("id", sectionId)
      .single();

    if (!sectionInfo) {
      return {
        redirect: {
          destination: "/course",
          permanent: false,
        },
      };
    }

    const courseInfo = Array.isArray(sectionInfo.course) ? sectionInfo.course[0] : sectionInfo.course!;

    const user = await getCurrentUser(supabase);
    const { data: currentUserMembership } = await supabase
      .from("membership")
      .select("role")
      .eq("section", sectionId)
      .eq("user", user?.id)
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

    if (error) console.error(error);

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
          department: courseInfo.department,
          number: courseInfo.number,
        },
        section: {
          number: sectionInfo.section_number,
        },
        assignments,
        isInstructor,
      },
    };
  });

const AssignmentBlock: React.FC<{ assignment: Assignment; isInstructor: boolean }> = ({ assignment, isInstructor }) => {
  const { title, submissionCount, warnings, id } = assignment;
  const router = useRouter();

  return (
    <div className="bg-gray-800/25 border border-gray-400 w-full p-3 rounded-md">
      <div className="flex justify-between flex-wrap-reverse">
        <div className="flex flex-col gap-4">
          <div className="">
            <div className="text-xl flex gap-2 items-center">
              <Link href={`${router.asPath}/${id}`} className="text-xl font-bold hover:underline">
                {title}
              </Link>
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
        <h1 className="text-gray-400 mb-2 w-full sm:w-auto">
          <ul className="flex rounded-md border border-gray-400 shadow-xl w-min mx-auto">
            <PanelLink title="View" position={isInstructor ? "first" : "only"} href={`${router.asPath}/${id}`}>
              <HiEye />
            </PanelLink>

            {isInstructor && (
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
    </div>
  );
};

const Assignments: NextPage<AssignmentListProps> = ({ assignments, course, section, isInstructor }) => {
  const courseName = `${course.department} ${course.number}.${section.number}`;

  return (
    <div className="flex">
      <div className="text-gray-100 px-12 pt-6 flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
          <h1 className="text-3xl font-bold">Assignments - {courseName}</h1>
          {isInstructor && (
            <div className="flex flex-wrap gap-4">
              <Button variant="secondary" href={`/course/${course.id}/edit`}>
                Edit course
              </Button>
              <Button href={`/course/${course.id}/assignment/new`}>
                <HiPlus /> New assignment
              </Button>
            </div>
          )}
        </div>
        <div className="grid xl:grid-cols-2 gap-6">
          {assignments.map((assignment, index) => {
            return <AssignmentBlock assignment={assignment} isInstructor={isInstructor} key={index} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Assignments;
