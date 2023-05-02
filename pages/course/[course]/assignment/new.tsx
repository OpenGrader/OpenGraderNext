import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext, NextPage } from "next";
import { getCurrentUser, queryParamToNumber } from "util/misc";
import withProtected from "util/withProtected";
import { useState, useReducer } from "react";
import { nanoid } from "nanoid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { HiOutlineChevronDoubleRight, HiOutlineChevronDoubleLeft, HiOutlinePlus, HiOutlineMinus } from "react-icons/hi";
import { MouseEvent } from "react";
import Button from "Components/Button";

interface CreateAssignmentProps {
  courseId: number;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) =>
  withProtected(ctx, async (ctx) => {
    const courseId = queryParamToNumber(ctx.query?.course);
    const supabase = createServerSupabaseClient(ctx);
    const user = await getCurrentUser(supabase);
    const { data: currentUserMembership } = await supabase
      .from("membership")
      .select("role")
      .eq("section", courseId)
      .eq("user", user?.id)
      .single();

    if (!currentUserMembership || currentUserMembership.role === "STUDENT") {
      return {
        redirect: {
          destination: `/course/${courseId}/assignment`,
          permanent: false,
        },
      };
    }
    return {
      props: {
        courseId,
      },
    };
  });

interface fileState {
  fileStore: (File | undefined)[];
}
type Payload =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "update"; location: number; file: File | undefined };

function fileReducer(fileState: fileState, action: Payload): fileState {
  switch (action.type) {
    case "increment":
      if (fileState.fileStore.length >= 10) return { fileStore: fileState.fileStore }; // has to be atleast one case
      else return { fileStore: fileState.fileStore.concat([undefined, undefined]) };
    case "decrement":
      if (fileState.fileStore.length <= 2) return { fileStore: fileState.fileStore }; // has to be atleast one case
      else return { fileStore: fileState.fileStore.slice(0, -2) };

    case "update":
      let array = [...fileState.fileStore];
      array[action.location] = action.file;
      return { fileStore: array };
    default:
      throw new Error();
  }
}

const CreateAssignment: NextPage<CreateAssignmentProps> = ({ courseId }) => {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [title, setTitle] = useState<string>();
  const [lang, setLang] = useState<string>("c/c++");
  const [desc, setDesc] = useState<string>();
  const [fileState, fileDispatch] = useReducer(fileReducer, { fileStore: [undefined, undefined] });
  const [count, setCount] = useReducer((state: number, action: string) => {
    switch (action) {
      case "increment":
        return Math.min(state + 2, fileState.fileStore.length - 2);
      case "decrement":
        return Math.max(state - 2, 0);
      default:
        throw new Error(`Unhandled action type: ${action}`);
    }
  }, 0);

  const upload = async (filePath: string, file: File | undefined) => {
    await supabase.storage
      .from("spec-storage")
      .upload(filePath, file || "")
      .catch((error) => console.log(error));
  };

  const fileUpload = async () => {
    for (let x = 0; x < count; x++) {
      if (fileState.fileStore[x] == undefined) throw new Error("Test case contains empty file");
    }
    let paths: string[] = [];
    for (let x = 0; x < fileState.fileStore.length; x++) {
      const path = `${courseId}/${nanoid()}.${fileState.fileStore[x]?.name.split(".").pop()}`;
      paths.push(path);
      upload(path, fileState.fileStore[0]);
    }
    console.log(paths);
    createRecord(paths);
  };

  const createRecord = async (paths: string[]) => {
    const { data: assignment, error } = await supabase
      .from("assignment")
      .insert({
        section: courseId,
        title: title || "Untitled",
        description: desc || "No Description",
        is_open: true,
        is_late: false,
        input_file: paths[0],
        output_file: paths[1],
        language: lang.toLowerCase(),
      })
      .select();

    if (error) {
      console.log(error);
      router.push(`/course/${courseId}/assignment`);
    }
    const assignmentId = assignment?.[0]?.id;

    if (assignmentId) {
      let records = [];
      for (let x = 0; x < paths.length / 2; x++) {
        records.push({
          assignment_id: assignmentId,
          input_file: paths[x * 2],
          output_file: paths[x * 2 + 1],
        });
      }
      const { data, error } = await supabase.from("test_cases").insert(records);
      if (error) {
        console.log(error);
        router.push(`/course/${courseId}/assignment`);
      } else {
        router.push(`/course/${courseId}/assignment/${assignmentId}`);
      }
    } else {
      router.push(`/course/${courseId}/assignment`);
    }
  };

  const handleClick = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    fileUpload().catch((error) => {
      console.log(error);
    });
  };

  return (
    <div className="flex">
      <div className="text-gray-100 px-12 pt-6 flex flex-col gap-4 w-full">
        <h1 className="font-bold text-3xl">Create a new assignment</h1>
        <form className="grid grid-cols-1 gap-4">
          <div className="">
            <label htmlFor="title" className="block text-sm font-medium text-gray-200">
              Title
            </label>
            <div className="mt-1">
              <input
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                name="title"
                id="title"
                required
                className="block w-full rounded-md bg-gray-950 border-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="">
            <label htmlFor="description" className="block text-sm font-medium text-gray-200">
              Description
            </label>
            <div className="mt-1">
              <textarea
                onChange={(e) => setDesc(e.target.value)}
                name="description"
                id="description"
                autoComplete="given-name"
                rows={6}
                className="block w-full rounded-md bg-gray-950 border-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="">
            <label htmlFor="language" className="block text-sm font-medium text-gray-200">
              Language
            </label>
            <div className="mt-1">
              <select
                onChange={(e) => setLang(e.target.value)}
                id="language"
                name="language"
                className="block w-full rounded-md bg-gray-950 border-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option>C/C++</option>
                <option>Python</option>
                <option>JavaScript</option>
                <option>Java</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between items-center text-xl font-bold">
            <h4>Test Case: {count / 2 + 1}</h4>
            <div className="flex">
              <button
                type="button"
                onClick={() => {
                  fileDispatch({ type: "decrement" });
                  if (count >= fileState.fileStore.length - 2) setCount("decrement");
                }}
              >
                <HiOutlineMinus />
                <p className="sr-only">{fileState.fileStore.length < 3 ? "Remove last test" : "No more tests"}</p>
              </button>
              <button type="button" onClick={() => setCount("decrement")}>
                <HiOutlineChevronDoubleLeft />
                <p className="sr-only">{count >= 0 ? "Previous Test" : "On first test"}</p>
              </button>
              <button type="button" onClick={() => setCount("increment")}>
                <HiOutlineChevronDoubleRight />
                <p className="sr-only">{count < fileState.fileStore.length - 1 ? "Next Test" : "No more tests"}</p>
              </button>
              <button type="button" onClick={() => fileDispatch({ type: "increment" })}>
                <HiOutlinePlus />
                <p className="sr-only">add test cases</p>
              </button>
            </div>
          </div>
          <div className="pb-4">
            <h1 className="text-sm font-medium text-gray-300 pb-2">Input definition</h1>
            <label
              htmlFor="input-def"
              className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-800/25 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700/25 transition"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg aria-hidden="true" fill="none" stroke="currentColor" className="w-12 h-12 mx-auto text-gray-600">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                {!fileState.fileStore[count] ? (
                  <>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">.txt (max. 50MB)</p>
                  </>
                ) : (
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    Currently selected: <span className="font-semibold">{fileState.fileStore[count]?.name}</span>
                  </p>
                )}
              </div>
              <input
                id="input-def"
                type="file"
                className="hidden"
                accept=".txt"
                onChange={(e) => fileDispatch({ type: "update", location: count, file: e.target.files?.[0] })}
              />
            </label>
          </div>

          <div className="pb-4">
            <h1 className="text-sm font-medium text-gray-300 pb-2">Output definition</h1>
            <label
              htmlFor="output-def"
              className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-800/25 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700/25 transition"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg aria-hidden="true" fill="none" stroke="currentColor" className="w-12 h-12 mx-auto text-gray-600">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                {!fileState.fileStore[count + 1] ? (
                  <>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">.txt (max. 50MB)</p>
                  </>
                ) : (
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    Currently selected: <span className="font-semibold">{fileState.fileStore[count + 1]?.name}</span>
                  </p>
                )}
              </div>
              <input
                id="output-def"
                type="file"
                className="hidden"
                accept=".txt"
                onChange={(e) => fileDispatch({ type: "update", location: count + 1, file: e.target.files?.[0] })}
              />
            </label>
          </div>

          <input type="hidden" value={courseId} name="section" id="section" />
          <Button
            type="submit"
            className="whitespace-nowrap w-min ml-auto mt-2"
            size="lg"
            onClick={(e: MouseEvent<HTMLButtonElement>) => handleClick(e)}
          >
            Create
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignment;
