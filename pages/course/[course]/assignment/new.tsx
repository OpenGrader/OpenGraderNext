import Sidebar from "Components/Sidebar";
import { GetServerSidePropsContext, NextPage } from "next";
import { queryParamToNumber } from "util/misc";
import withProtected from "util/withProtected";
import { useState } from "react";
import { nanoid } from "nanoid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { MouseEvent } from "react";

interface CreateAssignmentProps {
  courseId: number;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) =>
  withProtected(ctx, async (ctx) => {
    const courseId = queryParamToNumber(ctx.query?.course);

    return {
      props: {
        courseId,
      },
    };
  });

const CreateAssignment: NextPage<CreateAssignmentProps> = ({ courseId }) => {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [inputFile, setInputFile] = useState<File | undefined>();
  const [outputFile, setOutputFile] = useState<File | undefined>();

  const fileUpload = async () => {
    const upload = async (filePath: string, file: File | undefined) => {
      await supabase.storage
        .from("spec-storage")
        .upload(filePath, file || "")
        .catch((error) => console.log(error));
    };

    const inputID = nanoid();
    const outputID = nanoid();

    const inputPath = `${courseId}/${inputID}.${inputFile?.name.split(".").pop()}`;
    const outputPath = `${courseId}/${outputID}.${outputFile?.name.split(".").pop()}`;

    upload(inputPath, inputFile);
    upload(outputPath, outputFile);
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    fileUpload();
    router.push(`/course/${courseId}/assignment`);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="text-slate-100 px-12 pt-6 flex flex-col gap-4 w-10/12 ml-auto">
        <h1 className="font-bold text-3xl">Create a new assignment</h1>
        <form method="POST" action="/api/createAssignment" className="grid grid-cols-1 gap-4">
          <div className="">
            <label htmlFor="title" className="block text-sm font-medium text-gray-200">
              Title
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="title"
                id="title"
                required
                className="block w-full rounded-md bg-slate-950 border-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="">
            <label htmlFor="description" className="block text-sm font-medium text-gray-200">
              Description
            </label>
            <div className="mt-1">
              <textarea
                name="description"
                id="description"
                autoComplete="given-name"
                rows={6}
                className="block w-full rounded-md bg-slate-950 border-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="">
            <label htmlFor="language" className="block text-sm font-medium text-gray-200">
              Language
            </label>
            <div className="mt-1">
              <select
                id="language"
                name="language"
                className="block w-full rounded-md bg-slate-950 border-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                <option>C/C++</option>
                <option>Python</option>
                <option>JavaScript</option>
                <option>Java</option>
              </select>
            </div>
          </div>

          <div className="pb-4">
            <h1 className="text-sm font-medium text-gray-300 pb-2">Input definition</h1>
            <label
              htmlFor="input-def"
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
                {!inputFile ? (
                  <>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">.zip (max. 50MB)</p>
                  </>
                ) : (
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    Currently selected: <span className="font-semibold">{inputFile?.name}</span>
                  </p>
                )}
              </div>
              <input
                id="input-def"
                type="file"
                className="hidden"
                accept=".txt"
                onChange={(e) => setInputFile(e.target.files?.[0])}
              />
            </label>
          </div>

          <div className="pb-4">
            <h1 className="text-sm font-medium text-gray-300 pb-2">Output definition</h1>
            <label
              htmlFor="output-def"
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
                {!outputFile ? (
                  <>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">.zip (max. 50MB)</p>
                  </>
                ) : (
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    Currently selected: <span className="font-semibold">{outputFile?.name}</span>
                  </p>
                )}
              </div>
              <input
                id="output-def"
                type="file"
                className="hidden"
                accept=".txt"
                onChange={(e) => setOutputFile(e.target.files?.[0])}
              />
            </label>
          </div>

          <input type="hidden" value={courseId} name="section" id="section" />
          <button
            type="button"
            onClick={(e) => handleClick(e)}
            className="text-center items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium leading-4 ring-offset-slate-900 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignment;
