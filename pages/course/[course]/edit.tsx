import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Button from "Components/Button";
import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import withProtected from "util/withProtected";

interface EditSectionProps {
  id: number;
  section_number: string;
  course: {
    department: string;
    number: string;
  };
}

export const getServerSideProps: GetServerSideProps = async (ctx) =>
  withProtected(ctx, async (ctx) => {
    const sectionId = ctx.query?.course;

    const supabase = createServerSupabaseClient(ctx);
    const { data: section } = await supabase
      .from("section")
      .select("id, section_number, course ( department, number )")
      .eq("id", sectionId)
      .single();

    if (!section) {
      return {
        redirect: {
          destination: "/course",
        },
        props: {},
      };
    }

    console.log({ section });

    return {
      props: {
        ...section,
      },
    };
  });

const EditSection: NextPage<EditSectionProps> = ({ id, section_number, course }) => {
  const [sectionNumber, setSectionNumber] = useState(section_number);
  const [courseDepartment, setCourseDepartment] = useState(course.department);
  const [courseNumber, setCourseNumber] = useState(course.number);

  return (
    <div className="flex">
      <div className="text-slate-100 px-12 pt-6 flex flex-col gap-4 w-full">
        <h1 className="font-bold text-3xl">
          Update course: {course.department} {course.number}.{section_number}
        </h1>
        <form method="POST" action="/api/updateCourse" className="grid grid-cols-1 gap-4">
          <input type="hidden" value={id} id="sectionId" name="sectionId" />
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-200">
                Department
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="courseDepartment"
                  id="courseDepartment"
                  required
                  value={courseDepartment}
                  onChange={(e) => setCourseDepartment(e.target.value)}
                  className="block w-full rounded-md bg-slate-950 border-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-200">
                Course number
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="courseNumber"
                  id="courseNumber"
                  required
                  value={courseNumber}
                  onChange={(e) => setCourseNumber(e.target.value)}
                  className="block w-full rounded-md bg-slate-950 border-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="">
            <label htmlFor="description" className="block text-sm font-medium text-gray-200">
              Section number
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="sectionNumber"
                id="sectionNumber"
                required
                value={sectionNumber}
                onChange={(e) => setSectionNumber(e.target.value)}
                className="block w-full rounded-md bg-slate-950 border-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="whitespace-nowrap w-min ml-auto">
            Update
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditSection;
