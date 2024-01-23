import { useContext } from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import Button from "../components/Button";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import http from "../utils/http";

type FormValues = {
  email: string;
  password: string;
};

type UserData = {
  created_at: string;
  email: string;
  id: number;
  name: string;
  role: string;
  updated_at: string;
};

const Login = () => {
  const { auth, setAuth } = useContext(AuthContext);

  const navigate = useNavigate();
  const { state } = useLocation();
  const { from = "/" } = state || {}; //When from is empty then the default is "/", when not than is the coresponding page url for example /profile

  const form = useForm<FormValues>();

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  console.log(auth);

  // This function is called when the fields are correctly validated
  const onSubmit = async (data: FormValues) => {
    //Logic for login
    try {
      await http.get("/sanctum/csrf-cookie");
      const response = await http.post("/api/login", data);

      const userData = response.data.userData as UserData;
      console.log(userData);

      setAuth((prevAuth) => {
        let role = null;

        if (userData.role === "admin") {
          role = userData.role as "admin";
        }

        if (userData.role === "user") {
          role = userData.role as "user";
        }

        return {
          ...prevAuth,
          id: userData.id,
          username: userData.name,
          role: role,
        };
      });

      navigate(from);
    } catch (exception: any) {
      console.log(exception);
      // console.log(Object.entries(RootError));

      if (exception.response.status === 401) {
        const RootErrors = exception.response.data.errors;
        // console.log(RootErrors);

        for (let [fieldName, errorList] of Object.entries(RootErrors)) {
          // console.log(fieldName, errorList);

          const RootError = (errorList as any[]).map((message: any) => ({
            message,
          }));
          type FieldName = "email" | "password" | "root";
          setError(fieldName as FieldName, RootError[0]);
        }
      }

      // console.log(errors);
    }
  };

  // This function is called when when we have validation errors
  const onError = () => {
    console.log("Formular Error");
  };

  return (
    <>
      <section className="flex items-center justify-center w-screen h-screen sm:p-10 bg-slate-400">
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          noValidate
          className="flex flex-col self-center gap-4 p-10 bg-gray-100 border rounded-md w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[35%]"
        >
          <h1 className="pb-8 text-3xl font-bold">Login</h1>

          <div className="flex flex-col">
            <label htmlFor="email">E-Mail</label>
            <input
              className="h-10 p-2 border-2 border-gray-300 rounded"
              type="email"
              id="email"
              {...register("email", {
                // required: {
                //   value: true,
                //   message: "Please enter an email address",
                // },
                // pattern: {
                //   value:
                //     /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
                //   message: "Invalid email format!",
                // },
              })}
            />
            <p className="text-red-600">{errors.email?.message}</p>
          </div>

          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              className="h-10 p-2 border-2 border-gray-300 rounded"
              type="password"
              id="password"
              {...register("password", {
                // required: {
                //   value: true,
                //   message: "Please enter your password",
                // },
              })}
            />
            <p className="text-red-600">{errors.password?.message}</p>
            <p className="text-red-600 ">{errors.root?.message}</p>
          </div>

          <Button
            styles=""
            disabled={isSubmitting}
            value="Login"
            type="submit"
            onClick={() => null}
          />

          <div className="flex flex-col items-center justify-center m-4">
            <div className="w-full h-[1px] border border-gray-400 "></div>
            <p className="text-gray-500 ">OR</p>
          </div>

          <div className="flex self-center gap-1">
            <p>Need an account?</p>
            <NavLink className="underline" to="/register">
              REGISTER
            </NavLink>
          </div>
        </form>
      </section>
      <DevTool control={control} />
    </>
  );
};

export default Login;