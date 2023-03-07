import { NextApiHandler } from "next";
import { supabaseAdmin } from "util/supabaseClient";
import { nanoid } from "nanoid";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export const handler: NextApiHandler = async (req, res) => {
  const body = req.body;

  const upload = async (filePath: string, file: File | undefined) => {
    await supabaseAdmin.storage
      .from("spec-storage")
      .upload(filePath, file || "")
      .catch((error) => console.log(error));
  };

  console.log("HERE");
  console.log({ body });

  const inputID = nanoid();
  const outputID = nanoid();
  const inputPath = `${body.courseID}/${inputID}.${body.inputFile?.filename.split(".").pop()}`;
  const outputPath = `${body.courseID}/${outputID}.${body.outputFile?.filename.split(".").pop()}`;

  upload(inputPath, body.inputFile);
  upload(outputPath, body.outputFile);
  console.log(body.courseID)
  const { data: assignment, error } = await supabaseAdmin
    .from("assignment")
    .insert({
      section: body.courseID,
      title: body.title,
      description: body.desc,
      is_open: true,
      is_late: false,
      input_file: inputPath,
      output_file: outputPath,
      language: String(body.lang).toLowerCase(),
    })
    .select();

  if (error) {
    return res.status(500).send(error);
  }

  const assignmentId = assignment?.[0]?.id;

  if (assignmentId) {
    return res.status(200).json(`/course/${body.section}/assignment/${assignmentId}`);
  }

  return res.status(404).json(`"An unknown error has occurred."`);
};

export default handler;
