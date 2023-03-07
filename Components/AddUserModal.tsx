import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { HiUserAdd, HiX } from "react-icons/hi";
import { User } from "types";

interface AddUserModalProps {
  users: User[];
  open: boolean;
  setOpen: (o: boolean) => void;
  assignUser: (s: number) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ users, open, setOpen, assignUser }) => {
  const [selectedUid, setUid] = useState<number>();
  const saveAndClose = () => {
    console.log(selectedUid);
    if (!selectedUid) return;
    assignUser(selectedUid);
    setOpen(false);
  };
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
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-slate-900 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-slate-900 text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setOpen(false)}>
                    <span className="sr-only">Close</span>
                    <HiX className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-cyan-800 sm:mx-0 sm:h-10 sm:w-10">
                    <HiUserAdd className="h-6 w-6 text-cyan-400" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-100">
                      Add user to this course
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-400">Select a user to add to this course:</p>
                      <select
                        value={selectedUid}
                        onChange={(e) => setUid(parseInt(e.target.value))}
                        className="bg-slate-900">
                        <option value={undefined} className="italic">
                          Select a user...
                        </option>
                        {users.map((user) => (
                          <option value={user.id} key={user.id}>
                            {[user.given_name, user.family_name, user.euid].filter((v) => !!v).join(" ")}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    disabled={!selectedUid}
                    className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto ${
                      !selectedUid ? "cursor-not-allowed bg-cyan-800" : "bg-cyan-600 hover:bg-cyan-500"
                    }`}
                    onClick={() => saveAndClose()}>
                    Add
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-gray-100 shadow-sm ring-1 ring-inset ring-slate-700 hover:bg-slate-700 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}>
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AddUserModal;
