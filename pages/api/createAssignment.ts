import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiHandler } from "next";
import { getCurrentUser } from "util/misc";
import { supabaseAdmin } from "util/supabaseClient";

export const handler: NextApiHandler = async (req, res) => {
  const body = req.body;

  const userSbase = createServerSupabaseClient({ req, res });
  const user = await getCurrentUser(userSbase);

  const { data: userMembership } = await userSbase
    .from("membership")
    .select("role")
    .eq("section", body.section)
    .eq("user", user?.id)
    .single();
  if (!userMembership || userMembership.role === "STUDENT") {
    return res.status(403).json(`"Not authorized to create an assignment in section ${body.section}"`);
  }

  const { data: assignment, error } = await supabaseAdmin
    .from("assignment")
    .insert({
      section: body.section,
      title: body.title,
      description: body.description,
      is_open: true,
      is_late: false,
      input_file: body["input-def"],
      output_file: body["output-def"],
      language: body.language.toLowerCase(),
    })
    .select();

  if (error) {
    return res.status(500).send(error);
  }

  const assignmentId = assignment?.[0]?.id;

  if (assignmentId) {
    return res.status(200).redirect(`/course/${body.section}/assignment/${assignmentId}`);
  }

  return res.status(404).json(`"An unknown error has occurred."`);
};

export default handler;
