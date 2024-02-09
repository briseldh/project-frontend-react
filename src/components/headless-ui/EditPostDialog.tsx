import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import http from "../../utils/http";
import { SubmitHandler, useForm } from "react-hook-form";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

// Icons and Images
import editIcon from "../../assets/icons/pen-solid.svg";

// Types and Styles
import { File, Post } from "../../types/loaderTypes";

type Props = {
  post: Post;
  uploads: File[];
};

type FormValues = {
  title: string;
  text: string;
};

export default function EditPostDialog({ post, uploads }: Props) {
  let [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  //   Formular Inhalte
  const form = useForm<FormValues>();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  // This function is called when the fields are correctly validated
  const onSubmit: SubmitHandler<FormValues> = async (data, e) => {
    try {
      await http.get("/sanctum/csrf-cookie");
      await http.patch(`/api/post/update/${e?.target.id}`, data);

      // navigate("/profile");
    } catch (exception: any) {
      console.log(exception);
    }
  };

  // This function is called when when we have validation errors
  const onError = () => {
    console.log("Formular Error");
  };

  const baseUrl = "http://localhost:80";

  return (
    <>
      <div className="flex items-center gap-2 text-gray-200 cursor-pointer hover:underline">
        <img src={editIcon} alt="edit-icon" className="w-4 h-4 " />
        <h4 onClick={openModal}>Edit Post</h4>
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
                <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Edit Post
                  </Dialog.Title>

                  <form
                    id={`${post.id}`}
                    onSubmit={handleSubmit(onSubmit, onError)}
                    noValidate
                    className="flex flex-col self-center w-full gap-4 p-10 bg-gray-100 border rounded-md"
                  >
                    {uploads?.map((upload) => {
                      if (post.id !== Number(upload.post_id)) return;

                      return (
                        <div
                          key={upload.id}
                          className="overflow-hidden rounded-lg xs:w-full"
                        >
                          <img
                            src={`${baseUrl}/${upload.path}`}
                            alt={upload.alt_text}
                            className="xs:w-full "
                          />
                        </div>
                      );
                    })}

                    <div className="flex flex-col">
                      <label htmlFor="title">Title</label>
                      <input
                        className="h-10 p-2 border-2 border-gray-300 rounded"
                        // value={post.title}
                        type="text"
                        id="title"
                        {...register("title", {
                          // required: {
                          //   value: true,
                          //   message: "Please enter a title for this post",
                          // },
                        })}
                      />
                      <p className="text-red-600">{errors.title?.message}</p>
                    </div>

                    <div>
                      <textarea
                        className="w-full p-2 border-2 border-gray-300 rounded "
                        // value={post.text}
                        placeholder="Post Discription ..."
                        {...register("text", {})}
                      ></textarea>
                    </div>

                    <div className="flex self-center justify-center gap-2 mt-4">
                      <button
                        type="submit"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        // onClick={closeModal}
                      >
                        Confirm Changes
                      </button>

                      {isSubmitting ? (
                        <Oval
                          height={"32"}
                          width={"32"}
                          color="#6464C8"
                          strokeWidth={"4"}
                        />
                      ) : null}
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}