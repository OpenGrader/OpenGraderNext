import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Sidebar from "Components/Sidebar";
import { GetServerSidePropsContext, NextPage } from "next";
import Link from "next/link";
import { Assignment } from "types";
import withProtected from "util/withProtected";

type CourseSection = {
  id: number;
  section_number: string;
  course: {
    department: string;
    number: string;
  };
  assignment: Assignment[];
};

interface CourseListProps {
  sections: CourseSection[];
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) =>
  withProtected(ctx, async (ctx) => {
    const supabase = createServerSupabaseClient(ctx);

    const sections = await supabase
      .from("section")
      .select(
        `id,
      course (
        department,
        number
      ),
      assignment (
        id,
        title,
        created_at,
        is_open,
        is_late
      ),
      section_number`,
      )
      .order("created_at", { foreignTable: "assignment", ascending: false });

    return {
      props: {
        sections: sections.data,
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

const SectionCard: React.FC<CourseSection> = ({ id, section_number, course, assignment }) => {
  return (
    <div className="divide-y divide-gray-600 overflow-hidden rounded-lg bg-slate-800 shadow w-full">
      <div className="px-4 py-5 sm:px-6 text-xl flex items-center gap-4">
        {course.department} {course.number}.{section_number}{" "}
        <Link
          href={`/course/${id}/assignment`}
          className="inline-flex items-center rounded border border-transparent bg-cyan-700 px-2.5 py-1 text-xs font-medium text-cyan-50 shadow-sm hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2">
          View course
        </Link>
      </div>
      <div className="px-4 py-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <strong className="font-semibold">Recent assignments</strong>
          <ul>
            {assignment.map((a) => (
              <li key={a.id}>
                {a.title} {makeInfoString(a)}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <strong className="font-semibold">Recent submissions</strong>
          <ul>
            <li>Basic Sorting - Jackson Welsh (jcw0351)</li>
            <li>Basic Sorting - Dayton Forehand (dbz0432)</li>
            <li>Basic Sorting - Kobe Edmond (kde0232)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const CourseListPage: NextPage<CourseListProps> = ({ sections }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="text-slate-100 px-12 pt-6 flex flex-col gap-4 w-full ">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h1 className="text-3xl font-bold w-full">Your Courses</h1>
          {sections.map((section) => (
            <SectionCard {...section} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseListPage;
