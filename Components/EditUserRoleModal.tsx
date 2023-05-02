import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { HiUserGroup, HiX } from "react-icons/hi";
import { User } from "types";
import Button from "./Button";

interface AddUserModalProps {
  user: User | undefined;
  role: "STUDENT" | "INSTRUCTOR";
  open: boolean;
  setOpen: (o: boolean) => void;
  updateRole: (u: User, role: "STUDENT" | "INSTRUCTOR") => void;
}

const roles = [
  {
    id: "STUDENT",
    name: "Student",
    description: "Can submit assignments to the course and view their own submissions, grades, and feedback.",
  },
  {
    id: "INSTRUCTOR",
    name: "Instructor",
    description:
      "Can create and delete assignments, view all student submissions, leave feedback, and manage course membership.",
  },
];

const EditUserRoleModal: React.FC<AddUserModalProps> = ({ user, role, open, setOpen, updateRole }) => {
  const [selectedRole, setRole] = useState<AddUserModalProps["role"]>(role);

  const saveAndClose = () => {
    if (user) {
      updateRole(user, selectedRole);
    }
    setOpen(false);
  };

  const canonicalUserName = user?.name === " " ? user.euid : user?.name;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-800/75 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform rounded-lg bg-gray-900 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-gray-900 text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <HiX className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-cyan-800 sm:mx-0 sm:h-10 sm:w-10">
                    <HiUserGroup className="h-6 w-6 text-cyan-400" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-100">
                      Update roles for {canonicalUserName}
                    </Dialog.Title>
                    <div className="mt-2 w-full">
                      <fieldset>
                        <legend className="sr-only">Role</legend>
                        <div className="space-y-5">
                          {roles.map((option) => (
                            <div key={option.id} className="relative flex items-start">
                              <div className="flex h-6 items-center">
                                <input
                                  id={option.id}
                                  aria-describedby={`${option.id}-description`}
                                  name="role"
                                  type="radio"
                                  value={option.id}
                                  defaultChecked={option.id === role}
                                  className="h-4 w-4 border-gray-700 text-cyan-600 focus:ring-cyan-600"
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setRole(e.target.value as "STUDENT" | "INSTRUCTOR");
                                    }
                                  }}
                                />
                              </div>
                              <div className="ml-3 text-sm leading-6">
                                <label htmlFor={option.id} className="font-medium text-gray-50">
                                  {option.name}
                                </label>
                                <p id={`${option.id}-description`} className="text-gray-400">
                                  {option.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-4">
                  <Button type="button" variant="primary" onClick={() => saveAndClose()}>
                    Update
                  </Button>
                  <Button variant="secondary" type="button" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default EditUserRoleModal;
