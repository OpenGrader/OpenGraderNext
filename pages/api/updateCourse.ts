import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiHandler } from "next";
import { Section } from "types";
import { supabaseAdmin } from "util/supabaseClient";

export const handler: NextApiHandler = async (req, res) => {
  const body = req.body;

  console.log({ body });

  const supabase = createServerSupabaseClient({ req, res, resolvedUrl: req.url });

  const sbUser = await supabase.auth.getUser();
  if (!sbUser.data) {
    return res.status(401).json(`"You must be signed in to use this application."`);
  }

  const profile = await supabase.from("user").select("id").eq("auth_id", sbUser.data.user?.id).single();

  let { data: section } = await supabaseAdmin
    .from("section")
    .select("id, section_number, course ( id, department, number )")
    .eq("id", body.sectionId)
    .single();

  if (!section) {
    return res.status(404).json(`"Section ID ${body.sectionId} not found."`);
  }

  const sectionNumber = body.sectionNumber;
  const courseDepartment = body.courseDepartment;
  const courseNumber = body.courseNumber;

  const course = section.course as {
    id: number;
    department: string;
    number: string;
  };

  let finalCourseId = course.id;

  // if course changed, update that entity without messing up other courses
  if (course.number !== courseNumber || course.department !== courseDepartment) {
    // search for another existing course to link to
    const { data: targetCourse } = await supabaseAdmin
      .from("course")
      .select("id")
      .eq("department", courseDepartment)
      .eq("number", courseNumber)
      .single();

    if (!targetCourse) {
      // create a new course if we didn't find one
      await supabaseAdmin.from("course").insert({
        department: courseDepartment,
        number: courseNumber,
      });
      const { data: newCourse, error } = await supabaseAdmin
        .from("course")
        .select("id")
        .eq("department", courseDepartment)
        .eq("number", courseNumber)
        .single();
      if (newCourse) {
        finalCourseId = newCourse.id;
      } else {
        console.error(error);
        return res.status(500).json(`"An unexpected error has occurred."`);
      }
    } else {
      finalCourseId = targetCourse.id;
    }
  }

  // update the section
  await supabase
    .from("section")
    .update({
      section_number: sectionNumber,
      course: finalCourseId,
    })
    .eq("id", section.id);

  return res.status(200).redirect(`/course/${section?.id}/assignment`);
};

export default handler;
