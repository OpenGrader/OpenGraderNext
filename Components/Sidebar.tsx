import Link from "next/link";
import { useRouter } from "next/router";
import UserMenu from "./UserMenu";

const user = {
  name: "John D.",
  position: "Teacher",
};

const SideBarLinks = () => {
  const Options = [
    { text: "Assignments", link: "assignment" },
    { text: "Students", link: "student" },
    { text: "Reports", link: "report" },
  ];

  const router = useRouter();

  // split path into parts
  const splitPath = router.asPath.split("/");
  let courseId = "-1";
  // course ID is third component of path, grab that
  if (splitPath.length >= 3) {
    courseId = splitPath[2];
  }

  return (
    <>
      {Options.map((option, index) => {
        const link = "/course/" + courseId + "/" + option.link;
        if (router.asPath.toString() === link)
          return (
            <Link
              href={link}
              key={index}
              className="bg-slate-900 h-10 w-full rounded-lg text-left px-2 flex items-center">
              {option.text}
            </Link>
          );
        else
          return (
            <Link
              href={link}
              key={index}
              className="bg-slate-800 h-10 w-full rounded-lg text-left px-2 flex items-center">
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
    <div className="h-screen w-2/12 flex flex-col text-gray-50 bg-zinc-900 justify-between">
      <div className=" p-3 flex flex-col gap-6 font-bold">
        <h1 className="text-center text-3xl">OpenGrader</h1>
        <SideBarLinks />
      </div>
      <div className="w-full h-20 px-4 flex items-center justify-between bg-zinc-800">
        <div className="flex items-center gap-4">
          <img src="/UserPlaceholder.png" className="h-12 aspect-square p-2 rounded-full" alt="" />
          <div className="">
            <h2 className="text-gray-200">{name}</h2>
            <h3 className="font-bold">{position}</h3>
          </div>
        </div>
        <UserMenu />
      </div>
    </div>
  );
};
export default Sidebar;
