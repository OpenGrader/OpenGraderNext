import Button from "Components/Button";
import Sidebar from "Components/Sidebar";
import { NextPage } from "next";

const CreateCourse: NextPage = () => {
  return (
    <div className="flex">
      <div className="text-slate-100 px-12 pt-6 flex flex-col gap-4 w-full">
        <h1 className="font-bold text-3xl">Create a new course</h1>
        <form method="POST" action="/api/createCourse" className="grid grid-cols-1 gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
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
            <div>
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

          <Button type="submit" size="lg" className="whitespace-nowrap w-min ml-auto">
            Create
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
