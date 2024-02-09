import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

//Components
import EditProfilePicDialog from "./EditProfilePicDialog";
import AddProfilePicDialog from "./AddProfilePicDialog";

//Image and Icons
import profile from "../../assets/imgs/149071.png";
import XmarkBlack from "../../assets/icons/xmark-solid-black.svg";

//Types and Styles
import { ProfilePic } from "../../types/loaderTypes";
import http from "../../utils/http";

type Props = {
  profilePic: ProfilePic;
};

export default function EditProfileDialog({ profilePic }: Props) {
  let [isOpen, setIsOpen] = useState(false);

  //Handling Functions
  const hadleDeleteProfilePicClick = async () => {
    try {
      await http.get("/sanctum/csrf-cookie");
      const response = await http.delete(
        `/api/profilePic/delete/${profilePic?.id}`
      );

      console.log(response);
    } catch (exception) {
      console.log(exception);
    }
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const baseUrl = "http://localhost:80";

  return (
    <>
      <div className="inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="p-2 px-4 font-medium text-white bg-blue-500 rounded-md text-md hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        >
          Edit Profile
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full mr-2 h-[500px] max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-gray-300 shadow-xl rounded-2xl">
                  <div className="flex items-center justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Edit Profile
                    </Dialog.Title>

                    <div
                      className="p-1 overflow-hidden rounded-full cursor-pointer hover:bg-gray-400"
                      onClick={closeModal}
                    >
                      <img
                        src={XmarkBlack}
                        alt="X-mark"
                        className="w-5 h-5"
                        onClick={closeModal}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-col items-center w-full py-6 gap-7">
                      <div className="flex items-center justify-between w-full pr-2">
                        <button
                          type="button"
                          onClick={hadleDeleteProfilePicClick}
                          className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                        >
                          Delete
                        </button>

                        {!profilePic ? (
                          <AddProfilePicDialog />
                        ) : (
                          <EditProfilePicDialog profilePicId={profilePic.id} />
                        )}
                      </div>

                      <img
                        src={
                          profilePic ? `${baseUrl}/${profilePic.path}` : profile
                        }
                        alt="profile-pic"
                        className="rounded-full w-44 h-44"
                      />
                    </div>
                  </div>

                  <div className="mt-4"></div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}