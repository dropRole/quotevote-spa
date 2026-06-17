import { useContext, useRef, type FC } from "react";
import "./login-form.css";
import InputField from "./InputField";
import Button from "./Button";
import { useNavigate } from "react-router";
import z from "zod";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SignupData } from "../api/quotevote/users.service";
import UsersService from "../api/quotevote/users.service";
import DialogContext from "../contexts/DialogContext";
import type { InputFields } from "../utils/types";

const loginSchema = z.object({
  username: z
    .string("Username must be provided")
    .min(6, "Username cannot be shorter than 6 character")
    .max(20, "Username cannot be longer than 20 characters"),
  pass: z
    .string("Password must be provided")
    .min(8, "Password cannot be shorter than 8 characters")
    .max(20, "Password cannot be longer than 20 characters")
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]*$/,
      "Password must contain a capital, numeric and special character",
    ),
});

export type LoginValidationSchema = z.infer<typeof loginSchema>;

const LoginForm: FC = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginValidationSchema>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();

  const { alertDialog } = useContext(DialogContext);

  const usersService = useRef(new UsersService());

  const login = async (data: SignupData) => {
    if (!usersService.current) return;

    alertDialog?.setOpen(true);

    const { success, message } = await usersService.current.login(data);

    if (alertDialog && alertDialog.setTitle && alertDialog.setMessage) {
      alertDialog?.setTitle("Login");
      alertDialog?.setMessage(message ?? "Failed to login");
    }

    if (success) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem("quotevote-session", "on");

        navigate("/");

        clearTimeout(timeoutId);
      }, 3000);
    }
  };

  const inputFields: InputFields<LoginValidationSchema> = [
    {
      label: "Username",
      type: "text",
      name: "username",
    },
    {
      label: "Password",
      type: "password",
      name: "pass",
    },
  ];

  return (
    <form id="loginForm" onSubmit={handleSubmit(login)}>
      <h4>
        Welcome <span>back!</span>
      </h4>
      <p>Hope you have a good day and inspire others.</p>
      {inputFields.map(({ label, type, name }) => (
        <InputField<LoginValidationSchema>
          key={name}
          label={label}
          type={type}
          name={name}
          register={register}
          error={errors[name as Path<LoginValidationSchema>]?.message ?? ""}
        />
      ))}
      <Button type="submit" className="login w-100" text="Login" />
      <p>
        <span>Don't have an account?</span>
        <span onClick={() => navigate("/signup")}>Sign up</span>
      </p>
    </form>
  );
};

export default LoginForm;
