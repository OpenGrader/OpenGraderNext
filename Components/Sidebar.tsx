import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getCurrentUser } from "util/misc";
import { HiOutlineAcademicCap, HiOutlineChartBar, HiOutlineClipboard, HiOutlineUsers } from "react-icons/hi";
import UserMenu from "./UserMenu";
import OpenGraderLogo from "./OpenGraderLogo";

const classNames = (...classes: string[]): string => classes.filter(Boolean).join(" ");

const SideBarLinks = () => {
  const router = useRouter();

  const routes = [
    { text: "Courses", link: "", icon: HiOutlineAcademicCap },
    { text: "Assignments", link: ":course/assignment", icon: HiOutlineClipboard },
    { text: "Students", link: ":course/student", icon: HiOutlineUsers },
    { text: "Reports", link: ":course/report", icon: HiOutlineChartBar },
  ];

  const splitPath = router.asPath.split("/");
  let courseId = "-1";
  if (splitPath.length >= 3) {
    courseId = splitPath[2];
  } else {
    routes.splice(1, routes.length - 1);
  }

  return (
    <nav className="mt-5 flex-1 space-y-1 bg-gray-800 px-2" aria-label="Sidebar">
      {routes.map((item) => {
        const link = "/course/" + item.link.replace(":course", courseId);
        const isCurrent = router.asPath.toString().replaceAll("/", "") === link.replaceAll("/", "");

        return (
          <Link
            key={item.text}
            href={link}
            className={classNames(
              isCurrent ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
              "group flex items-center rounded-md px-2 py-2 text-sm font-medium",
            )}>
            <item.icon
              className={classNames(
                isCurrent ? "text-gray-300" : "text-gray-400 group-hover:text-gray-300",
                "mr-3 h-6 w-6 flex-shrink-0",
              )}
              aria-hidden="true"
            />
            <span className="flex-1">{item.text}</span>
          </Link>
        );
      })}
    </nav>
  );
};

const Sidebar = () => {
  const supabase = useSupabaseClient();
  const [name, setName] = useState("");
  const [isInstructor, setInstructor] = useState(false);

  useEffect(() => {
    getCurrentUser(supabase).then((user) => {
      setName(user?.given_name + " " + user?.family_name);
    });

    supabase.auth.getUser().then(({ data }) => {
      const userId = data.user?.id;
      supabase
        .rpc("is_instructor", { uid: userId })
        .single()
        .then(({ data }) => {
          setInstructor(data);
        });
    });
  }, []);
  const position = isInstructor ? "Instructor" : "Student";

  return (
    <div className="sticky relative top-0 h-screen flex-1 flex-col bg-gray-800">
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <div className="flex flex-shrink-0 items-center px-4 -mt-4">
          <OpenGraderLogo />
        </div>
        <SideBarLinks />
      </div>
      <div className="absolute bottom-0 w-full flex flex-shrink-0 bg-gray-700 p-4">
        <UserMenu name={name} position={position} />
      </div>
    </div>
  );
};
export default Sidebar;
