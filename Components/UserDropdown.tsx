import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { HiCheck, HiChevronDoubleDown } from "react-icons/hi";
import { User } from "types";

interface UserDropdownProps {
  users: User[];
  value: User | null;
  onChange: (u: User | null) => void;
  label: string;
}

const classNames = (...classes: any[]) => classes.filter(Boolean).join(" ");

const UserDropdown: React.FC<UserDropdownProps> = ({ users, value, onChange, label }) => {
  const [selected, setSelected] = useState<User | null>(value);
  useEffect(() => {
    onChange(selected);
  }, [selected]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium leading-6 text-gray-400">{label}</Listbox.Label>
          <div className="relative mt-1 w-full">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-gray-950 py-1.5 pl-3 pr-10 text-left text-gray-50 shadow-sm ring-1 ring-inset ring-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 sm:text-sm sm:leading-6">
              <span className="inline-flex w-full truncate">
                <span className="truncate">
                  {selected?.name && selected.name !== " " ? selected.name : selected?.euid}
                </span>
                <span className="ml-2 truncate text-gray-500">
                  {selected?.name && selected.name !== " " && selected.euid}
                </span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <HiChevronDoubleDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-in duration-100"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-950 py-1 text-base shadow-lg ring-1 ring-white ring-opacity-5 focus:outline-none sm:text-sm">
                {users.map((user) => (
                  <Listbox.Option
                    key={user.id}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-cyan-600 text-white" : "text-gray-50",
                        "relative cursor-default select-none py-2 pl-3 pr-9",
                      )
                    }
                    value={user}>
                    {({ selected, active }) => (
                      <>
                        <div className="flex">
                          <span className={classNames(selected ? "font-semibold" : "font-normal", "truncate")}>
                            {user.name !== " " ? user.name : user.euid}
                          </span>
                          <span className={classNames(active ? "text-indigo-200" : "text-gray-400", "ml-2 truncate")}>
                            {user.name !== " " && user.euid}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-gray-950" : "text-cyan-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4",
                            )}>
                            <HiCheck className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default UserDropdown;
