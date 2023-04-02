import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiHandler } from "next";

export const handler: NextApiHandler = async (req, res) => {
  const supabase = createServerSupabaseClient({ req, res });

  const { error } = await supabase.from("membership").insert({
    user: req.body.userId,
    section: req.body.sectionId,
    role: "STUDENT",
  });

  if (error) {
    return res.status(500).json(`"${error.message}"`);
  }

  return res.status(204).json(`"Success"`);
};

export default handler;
