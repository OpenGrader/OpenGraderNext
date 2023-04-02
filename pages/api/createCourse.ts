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

  let { data: course } = await supabaseAdmin
    .from("course")
    .select("*")
    .eq("department", body.department)
    .eq("number", body["course-number"])
    .single();

  let section: Section | null = null;

  if (course == null) {
    course = await supabaseAdmin
      .from("course")
      .insert({
        department: body["course-department"],
        number: body["course-number"],
      })
      .select()
      .single()
      .then((s) => s.data);

    console.log({ course });

    section = await supabaseAdmin
      .from("section")
      .insert({
        course: course.id,
        section_number: body["section-number"],
      })
      .select()
      .single()
      .then(({ data: s }) => ({
        id: s.id,
        section_number: s.section_number,
        course: s.course,
      }));

    console.log({ section });

    if (section == null) {
      return res.status(500).json(`"Unable to insert section."`);
    } else {
      await supabaseAdmin.from("membership").insert({
        user: profile.data?.id,
        section: (section as Section)!.id,
        role: "INSTRUCTOR",
      });
    }
  }

  const courseId = section!.id;

  if (courseId) {
    return res.status(200).redirect(`/course/${section?.id}/assignment`);
  }

  return res.status(404).json(`"An unknown error has occurred."`);
};

export default handler;
