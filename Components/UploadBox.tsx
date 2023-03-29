import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Router, useRouter } from "next/router";
import { nanoid } from "nanoid";
import { MouseEvent } from "react";

const Upload = ({
  bucket,
  courseID,
  assignmentID,
  userID,
  fileType
}: {
  bucket: string;
  courseID: number;
  assignmentID: number;
  userID: number | undefined;
  fileType?:string;
}) => {
  const routers = useRouter();
  const [file, setFile] = useState<File | undefined>();
  const supabase = useSupabaseClient();

  const fileUpload = async (file?: File) => {
    const fileID = nanoid();
    const extension = file?.name.split(".").pop();
    let path = `${courseID}/${assignmentID}/${userID}/${fileID}.${extension}`;
    const { data, error } = await supabase.storage.from(bucket).upload(path, file || "");
    createRecord(fileID, file?.name || "Unnamed", path);
  };

  const createRecord = async (nanoID: string, fileName: string, path: string) => {
    const { data, error } = await supabase.from("student_Submission").insert([
      {
        course_ID: courseID,
        assignment_ID: assignmentID,
        user_ID: userID,
        file_Name: fileName,
        nanoID: nanoID,
        file_Path: path,
      },
    ]);
  };
  

  const handleClick = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    fileUpload(file);
    routers.push("/course");
  };
  console.log(fileType);
  return (
    <>
      <form className="w-full flex flex-col items-end gap-2 p-2">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                aria-hidden="true"
                className="w-10 h-10 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              {!file ? (
                <>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{`${fileType || '.zip'} `}(max. 50MB)</p>
                </>
              ) : (
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  Currently selected: <span className="font-semibold">{file?.name}</span>
                </p>
              )}
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              accept={fileType}
              onChange={(e) => setFile(e.target.files?.[0])}
            />
          </label>
        </div>
        {file && (
          <div className="">
            <button
              type="button"
              className="inline-flex items-center rounded border border-transparent bg-cyan-700 px-4 py-2 text-2xl font-medium text-cyan-50 shadow-sm hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              onClick={(e) => handleClick(e)}>
              Submit
            </button>
          </div>
        )}
      </form>
    </>
  );
};

export default Upload;
