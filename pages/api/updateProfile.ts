import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiHandler } from "next";
import { supabaseAdmin } from "util/supabaseClient";

export const handler: NextApiHandler = async (req, res) => {
  const body = req.body;

  const supabase = createServerSupabaseClient({ req, res, resolvedUrl: req.url });

  console.log({ body });

  const { error } = await supabase
    .from("user")
    .update({
      given_name: body.given_name,
      family_name: body.family_name,
      euid: body.euid,
    })
    .eq("id", body.id);

  if (error) {
    return res.status(500).send(error);
  }

  return res.status(200).redirect("/course");
};

export default handler;
