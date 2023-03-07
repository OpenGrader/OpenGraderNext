import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiHandler } from "next";

export const handler: NextApiHandler = async (req, res) => {
  const supabase = createServerSupabaseClient({ req, res });

  console.log({ userId: req.body.userId, sectionId: req.body.sectionId });

  const { error, data } = await supabase
    .from("membership")
    .delete()
    .eq("user", req.body.userId)
    .eq("section", req.body.sectionId);

  console.log({ data, error });

  if (error) {
    return res.status(500).json(`"${error.message}"`);
  }

  return res.status(200).json(`"success"`);
};

export default handler;
