import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Sidebar from "Components/Sidebar";
import { GetServerSidePropsContext, NextPage } from "next";
import { getCurrentUser, queryParamToNumber } from "util/misc";
import withProtected from "util/withProtected";

interface CreateAssignmentProps {
  sectionId: number;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) =>
  withProtected(ctx, async (ctx) => {
    const sectionId = queryParamToNumber(ctx.query?.course);

    const supabase = createServerSupabaseClient(ctx);
    const user = await getCurrentUser(supabase);

    const { data: currentUserMembership } = await supabase
      .from("membership")
      .select("role")
      .eq("section", sectionId)
      .eq("user", user?.id)
      .single();

    if (!currentUserMembership || currentUserMembership.role === "STUDENT") {
      return {
        redirect: {
          destination: `/course/${sectionId}/assignment`,
          permanent: false,
        },
      };
    }

    return {
      props: {
        sectionId,
      },
    };
  });

const CreateAssignment: NextPage<CreateAssignmentProps> = ({ sectionId }) => {
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

          <div className="">
            <label htmlFor="input-def" className="block text-sm font-medium text-gray-300">
              Input definition
            </label>
            <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-700 px-6 pt-5 pb-6">
              <div className="space-y-1 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-12 h-12 mx-auto text-gray-600">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>

                <div className="flex text-sm text-gray-400">
                  <label
                    htmlFor="input-def"
                    className="relative cursor-pointer rounded-md font-medium text-blue-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-2 ring-offset-slate-900 hover:text-blue-400 focus:outline-none">
                    <span>Upload a file</span>
                    <input id="input-def" name="input-def" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-400">Text file up to 1MB</p>
              </div>
            </div>
          </div>

          <div className="">
            <label htmlFor="output-def" className="block text-sm font-medium text-gray-300">
              Output definition
            </label>
            <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-700 px-6 pt-5 pb-6">
              <div className="space-y-1 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-12 h-12 mx-auto text-gray-600">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>

                <div className="flex text-sm text-gray-400">
                  <label
                    htmlFor="output-def"
                    className="relative cursor-pointer rounded-md font-medium text-blue-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-2 ring-offset-slate-900 hover:text-blue-400 focus:outline-none">
                    <span>Upload a file</span>
                    <input id="output-def" name="output-def" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-400">Text file up to 1MB</p>
              </div>
            </div>
          </div>
          <input type="hidden" value={sectionId} name="section" id="section" />
          <button
            type="submit"
            className="text-center items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium leading-4 ring-offset-slate-900 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignment;
