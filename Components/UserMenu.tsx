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
    <Menu as="div" className="relative">
      <Menu.Button className="relative flex text-sm focus:outline-none">
        <div className="flex items-center">
          <div className="h-6 w-6">
            <HiOutlineUser className="h-full w-full" />
          </div>
          <div className="ml-3 text-left">
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
        <Menu.Items className="absolute left-0 bottom-0 mb-10 z-10 mt-2 w-48 origin-bottom-right rounded-md bg-black py-1 shadow-lg ring-1 ring-white ring-opacity-5 focus:outline-none">
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
