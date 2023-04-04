import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { HiOutlineUser } from "react-icons/hi";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

interface UserMenuProps {
  name: string;
  position: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ name, position }) => {
  const supabase = useSupabaseClient();

  const signOut = async () => supabase.auth.signOut().then(() => window.location.reload());

  return (
    <Menu
      as="div"
      className="relative w-[calc(100% + 3rem)] hover:bg-gray-900 -mx-6 lg:py-4 lg:px-4 rounded-full lg:rounded-none ring-white ring-offset-gray-900 ring-offset-1 active:ring-1 lg:active:ring-0">
      <Menu.Button className="relative flex text-sm focus:outline-none w-full">
        <div className="flex items-center">
          <div className="h-8 w-8 p-1.5 rounded-full border border-gray-200/75">
            <HiOutlineUser className="h-full w-full" />
          </div>
          <div className="ml-3 text-left hidden lg:block">
            <p className="text-sm font-medium text-white">{name}</p>
            <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">{position}</p>
          </div>
        </div>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        <Menu.Items className="absolute right-0 lg:right-auto lg:left-0 top-8 lg:top-auto lg:bottom-4 mb-10 z-10 mt-2 w-48 origin-bottom-right rounded-md bg-black py-1 shadow-lg ring-1 ring-white ring-opacity-5 focus:outline-none">
          <Menu.Item>
            <span className="text-sm text-gray-400 text-center block lg:hidden px-4 py-2 select-none">{name}</span>
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a
                href="/profile"
                className={classNames(active ? "bg-gray-900" : "", "block px-4 py-2 text-sm text-gray-300")}>
                Your Profile
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a href="#" className={classNames(active ? "bg-gray-900" : "", "block px-4 py-2 text-sm text-gray-300")}>
                Settings
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={signOut}
                className={classNames(
                  active ? "bg-gray-900" : "",
                  "block px-4 py-2 text-sm text-gray-300 w-full text-left",
                )}>
                Sign out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default UserMenu;
