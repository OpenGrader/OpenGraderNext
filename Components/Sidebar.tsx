import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  HiOutlineMenu,
  HiOutlineUsers,
  HiOutlineX,
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiOutlineClipboard,
} from "react-icons/hi";
import { getCurrentUser } from "util/misc";
import UserMenu from "./UserMenu";
import OpenGraderLogo from "./OpenGraderLogo";
import { useAppDispatch, useAppSelector } from "hooks";
import { loadUser, setCourses, setRole } from "store/userSlice";
import { Section } from "types";

interface SidebarProps {
  children: React.ReactNode | React.ReactNode[];
}

type SupaMembership = {
  section: {
    id: number;
    section_number: string;
    course: {
      id: number;
      number: string;
      department: string;
    };
  };
};

// const classNames = (...classes: string[]): string => classes.filter(Boolean).join(" ");

// const SideBarLinks = () => {
//   const router = useRouter();

//   const routes = [
//     { text: "Courses", link: "", icon: HiOutlineAcademicCap },
//     { text: "Assignments", link: ":course/assignment", icon: HiOutlineClipboard },
//     { text: "People", link: ":course/people", icon: HiOutlineUsers },
//     { text: "Reports", link: ":course/report", icon: HiOutlineChartBar },
//   ];

//   const splitPath = router.asPath.split("/");
//   let courseId = "-1";
//   if (splitPath.length >= 3) {
//     courseId = splitPath[2];
//   } else {
//     routes.splice(1, routes.length - 1);
//   }

//   return (
//     <nav className="mt-5 flex-1 space-y-1 bg-gray-800 px-2" aria-label="Sidebar">
//       {routes.map((item) => {
//         const link = "/course/" + item.link.replace(":course", courseId);
//         const isCurrent = router.asPath.toString().replaceAll("/", "") === link.replaceAll("/", "");

//         return (
//           <Link
//             key={item.text}
//             href={link}
//             className={classNames(
//               isCurrent ? "bg-gray-950 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
//               "group flex items-center rounded-md px-2 py-2 text-sm font-medium",
//             )}
//           >
//             <item.icon
//               className={classNames(
//                 isCurrent ? "text-gray-300" : "text-gray-400 group-hover:text-gray-300",
//                 "mr-3 h-6 w-6 flex-shrink-0",
//               )}
//               aria-hidden="true"
//             />
//             <span className="flex-1">{item.text}</span>
//           </Link>
//         );
//       })}
//     </nav>
//   );
// };

// const Sidebar = () => {
//   const supabase = useSupabaseClient();
//   const dispatch = useAppDispatch();
//   const user = useAppSelector((store) => store.user);

//   useEffect(() => {
//     getCurrentUser(supabase).then((user) => {
//       if (user) dispatch(loadUser(user));
//     });

//     supabase.auth.getUser().then(({ data }) => {
//       const userId = data.user?.id;
//       supabase
//         .rpc("is_instructor", { uid: userId })
//         .single()
//         .then(({ data: isInstructor }) => {
//           dispatch(setRole(isInstructor ? "INSTRUCTOR" : "STUDENT"));
//         });
//     });
//   }, []);

//   return (
//     <div className="sticky relative top-0 h-screen flex-1 flex-col bg-gray-800">
//       <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
//         <div className="flex flex-shrink-0 items-center px-4 -mt-4">
//           <OpenGraderLogo />
//         </div>
//         <SideBarLinks />
//       </div>
//       <div className="absolute bottom-0 w-full flex flex-shrink-0 bg-gray-700 p-4">
//         <UserMenu name={user.name ?? "Loading..."} position={user.role ?? "Loading..."} />
//       </div>
//     </div>
//   );
// };
// export default Sidebar;

const navigation = [
  { name: "Courses", href: "/course", icon: HiOutlineAcademicCap, requireCourse: false, isCurrent: false },
  {
    name: "Assignments",
    href: "/course/:course/assignment",
    icon: HiOutlineClipboard,
    requireCourse: true,
    isCurrent: false,
  },
  { name: "People", href: "/course/:course/people", icon: HiOutlineUsers, requireCourse: true, isCurrent: false },
  { name: "Reports", href: "/course/:course/report", icon: HiOutlineChartBar, requireCourse: true, isCurrent: false },
];

const filterDisallowedRoutes = (requireCourse: boolean, courseId: string): boolean =>
  !requireCourse || courseId !== "-1";

const hydrateRoute = (routePath: string, courseId: string): string => {
  console.log(`Replacing :course with ${courseId} in path ${routePath}`);
  return routePath.replace(/:course/g, courseId);
};

const classNames = (...classes: string[]): string => {
  return classes.filter(Boolean).join(" ");
};

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const supabase = useSupabaseClient();
  const dispatch = useAppDispatch();
  const user = useAppSelector((store) => store.user);

  const router = useRouter();
  const currentPath = router.asPath.toString().replaceAll("/", "");

  const splitPath = router.asPath.split("/");
  let courseId = "-1";
  if (splitPath.length >= 3) {
    courseId = splitPath[2];
  }

  const [hydratedNavigation, setHydratedNavigation] = useState(navigation);
  const currentRoute = hydratedNavigation.find((n) => n.href.replace(/\//g, "") === currentPath);

  const courses =
    user.courses?.map((course) => ({
      name: `${course.course.department} ${course.course.number}.${course.section_number}`,
      initial: course.course.number.charAt(0),
      href: `/course/${course.id}/assignment`,
      id: course.id,
    })) ?? [];

  courses.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (b.name > a.name) return 1;
    return 0;
  });

  useEffect(() => {
    // load user into the store
    getCurrentUser(supabase)
      .then((u) => {
        if (u) dispatch(loadUser(u));
      })
      .catch(() => {});

    supabase.auth.getUser().then(({ data }) => {
      const userId = data.user?.id;
      supabase
        .rpc("is_instructor", { uid: userId })
        .single()
        .then(({ data: isInstructor }) => {
          dispatch(setRole(isInstructor ? "INSTRUCTOR" : "STUDENT"));
        });
    });

    // hydrate navigation - this confuses SSR so need to do it as an effect
    setHydratedNavigation((nav) =>
      nav.map((route) => ({
        ...route,
        href: hydrateRoute(route.href, courseId),
        isCurrent: hydrateRoute(route.href, courseId).replaceAll("/", "") === currentPath,
      })),
    );

    hydratedNavigation.forEach((route) => {
      console.log({
        route,
        isCurrent: hydrateRoute(route.href, courseId).replaceAll("/", "") === currentPath,
        hrf: hydrateRoute(route.href, courseId).replaceAll("/", ""),
        currentPath,
        courseId,
      });
    });
  }, []);

  useEffect(() => {
    // load courses for user
    supabase
      .from("membership")
      .select("section ( id, section_number, course ( department, number ) )")
      .eq("user", user.id)
      .then(({ data: memberships }) => {
        if (memberships) {
          const courses = memberships
            .filter((m) => !!m)
            .reduce<Array<Section>>((prev, m) => {
              const cm = m as unknown as SupaMembership;
              prev.push({
                id: cm.section.id,
                section_number: cm.section.section_number,
                course: {
                  id: cm.section.course.id,
                  number: cm.section.course.number,
                  department: cm.section.course.department,
                },
              });
              return prev;
            }, []);

          dispatch(setCourses(courses));
        }
      });
  }, [user]);

  if (!user.id) return children;

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <div className="fixed inset-0 bg-gray-950/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full">
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                        <span className="sr-only">Close sidebar</span>
                        <HiOutlineX className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-950 px-6 pb-2 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center">
                      <OpenGraderLogo />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {hydratedNavigation
                              .filter((n) => filterDisallowedRoutes(n.requireCourse, courseId))
                              .map((item) => (
                                <li key={item.name}>
                                  <Link
                                    href={item.href}
                                    className={classNames(
                                      item.isCurrent
                                        ? "bg-gray-800 text-white"
                                        : "text-gray-400 hover:text-white hover:bg-gray-800",
                                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all",
                                    )}>
                                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                          </ul>
                        </li>
                        <li>
                          <div className="text-xs font-semibold leading-6 text-gray-400">Your courses</div>
                          <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {courses.map((course) => (
                              <li key={course.name}>
                                <Link
                                  href={course.href}
                                  className={classNames(
                                    course.id.toString() === courseId
                                      ? "bg-gray-800/50 text-white"
                                      : "text-gray-400 hover:text-white hover:bg-gray-800",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all",
                                  )}>
                                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                                    {course.initial}
                                  </span>
                                  <span className="truncate">{course.name}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-950 px-6">
            <div className="flex h-16 shrink-0 items-center">
              <OpenGraderLogo />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {hydratedNavigation
                      .filter((n) => filterDisallowedRoutes(n.requireCourse, courseId))
                      .map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={classNames(
                              item.isCurrent
                                ? "bg-gray-800 text-white"
                                : "text-gray-400 hover:text-white hover:bg-gray-800",
                              "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all",
                            )}>
                            <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                            {item.name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </li>
                <li>
                  <div className="text-xs font-semibold leading-6 text-gray-400">Your courses</div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {courses.map((course) => (
                      <li key={course.name}>
                        <Link
                          href={course.href}
                          className={classNames(
                            course.id.toString() === courseId
                              ? "bg-gray-800/50 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-800",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all",
                          )}>
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                            {course.initial}
                          </span>
                          <span className="truncate">{course.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="mt-auto">
                  <UserMenu name={user.name ?? "Loading..."} position={user.role ?? "Loading..."} />
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-950 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button type="button" className="-m-2.5 p-2.5 text-gray-400 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <HiOutlineMenu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-white">{currentRoute?.name ?? "OpenGrader"}</div>
          <UserMenu name={user.name ?? "Loading..."} position={user.role ?? "Loading..."} />
        </div>

        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </>
  );
};

export default Sidebar;
