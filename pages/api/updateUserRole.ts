import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiHandler } from "next";

export const handler: NextApiHandler = async (req, res) => {
  const supabase = createServerSupabaseClient({ req, res });

  const userId = req.body.userId;
  const sectionId = req.body.sectionId;
  const role = req.body.role;

  if ([userId, sectionId, role].includes(null)) {
    return res.status(400).json(`"Fields 'userId', 'sectionId', and 'role' are required."`);
  }

  if (!["STUDENT", "INSTRUCTOR"].includes(role)) {
    return res.status(400).json(`"Field 'role' MUST be one of [\"STUDENT\", \"INSTRUCTOR\"]."`);
  }

  console.log({ userId, sectionId, role });

  const { error, data } = await supabase
    .from("membership")
    .update({
      role,
    })
    .eq("user", userId)
    .eq("section", sectionId);

  console.log({ data });

  if (error) {
    return res.status(500).json(`"${error.message}"`);
  }

  return res.status(204).send(null);
};

export default handler;
