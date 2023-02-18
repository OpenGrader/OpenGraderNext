import Link from "next/link";
import { useRouter } from "next/router";
import UserMenu from "./UserMenu";

const user = {
  name: "John D.",
  position: "Teacher",
};

const SideBarLinks = () => {
  const routes = [
    { text: "Courses", link: "" },
    { text: "Assignments", link: ":course/assignment" },
    { text: "Students", link: ":course/student" },
    { text: "Reports", link: ":course/report" },
  ];

  const router = useRouter();
  const splitPath = router.asPath.split("/");
  let courseId = "-1";
  if (splitPath.length >= 3) {
    courseId = splitPath[2];
  } else {
    routes.splice(1, routes.length - 1);
  }

  return (
    <>
      {routes.map((option, index) => {
        const link = "/course/" + option.link.replace(":course", courseId);
        // replaceAll is a hack
        if (router.asPath.toString().replaceAll("/", "") === link.replaceAll("/", ""))
          return (
            <Link
              href={link}
              key={index}
              className="bg-slate-700 font-semibold w-full rounded-lg text-left px-4 py-2 flex items-center transition-all">
              {option.text}
            </Link>
          );
        else
          return (
            <Link
              href={link}
              key={index}
              className="w-full rounded-lg text-left px-4 py-2 flex items-center hover:bg-slate-800 focus:bg-slate-700 focus:text-slate-50 focus:animate-pulse transition-all text-slate-200">
              {option.text}
            </Link>
          );
      })}
    </>
  );
};

const Sidebar = () => {
  const { name, position } = user;
  return (
    <div className="h-screen fixed w-2/12 flex flex-col text-slate-50 bg-slate-950 justify-between pt-6">
      <div className="px-3 flex flex-col gap-3">
        <h1 className="text-center text-3xl font-bold mb-6">OpenGrader</h1>
        <SideBarLinks />
      </div>
      <div className="w-full h-20 px-4 flex items-center justify-between bg-slate-800">
        <div className="flex items-center gap-4">
          <img src="/UserPlaceholder.png" className="h-12 aspect-square p-2 rounded-full" alt="" />
          <div className="">
            <h2 className="text-slate-200">{name}</h2>
            <h3 className="font-bold">{position}</h3>
          </div>
        </div>
        <UserMenu />
      </div>
    </div>
  );
};
export default Sidebar;
