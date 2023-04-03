import Sidebar from "Components/Sidebar";
import { NextPage } from "next";

const CreateCourse: NextPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="text-slate-100 px-12 pt-6 flex flex-col gap-4 w-10/12 ml-auto">
        <h1 className="font-bold text-3xl">Create a new assignment</h1>
        <form method="POST" action="/api/createCourse" className="grid grid-cols-1 gap-4">
          <div className="">
            <label htmlFor="title" className="block text-sm font-medium text-gray-200">
              Department
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="course-department"
                id="course-department"
                required
                className="block w-full rounded-md bg-slate-950 border-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="">
            <label htmlFor="description" className="block text-sm font-medium text-gray-200">
              Course number
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="course-number"
                id="course-number"
                required
                className="block w-full rounded-md bg-slate-950 border-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="">
            <label htmlFor="description" className="block text-sm font-medium text-gray-200">
              Section number
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="section-number"
                id="section-number"
                required
                className="block w-full rounded-md bg-slate-950 border-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

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

export default CreateCourse;
