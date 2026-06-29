import { useContext, useRef, type FC } from "react";
import "./signup-form.css";
import defaultAvatar from "../assets/icons/default-avatar.png";
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

const signupSchema = z
  .object({
    email: z.email().max(255),
    name: z
      .string()
      .nonempty("Name must be provided")
      .max(100, "Name cannot be longer than 100 characters"),
    surname: z
      .string()
      .nonempty("Surname must be provided")
      .max(100, "Surname cannot be longer than 100 characters"),
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
    confirmPass: z
      .string("Password confirmation must be provided")
      .min(8, "Password confirmation cannot be shorter than 8 characters")
      .max(20, "Password confirmation cannot be longer than 20 characters")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]*$/,
        "Password confirmation must contain a capital, numeric and special character",
      ),
  })
  .refine(({ pass, confirmPass }) => pass === confirmPass, {
    error: "Passwords must match",
    path: ["confirmPass"],
  });

export type SignupValidationSchema = z.infer<typeof signupSchema>;

const SignupForm: FC = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignupValidationSchema>({
    resolver: zodResolver(signupSchema),
  });

  const navigate = useNavigate();

  const { alertDialog } = useContext(DialogContext);

  const usersService = useRef(new UsersService());

  const signup = async (data: SignupData) => {
    if (!usersService.current) return;

    alertDialog?.setOpen(true);

    const result = await usersService.current.signup(data);

    alertDialog?.setTitle("Sign up");
    alertDialog?.setMessage(result.message ?? "Failed to sign up");
  };

  const inputFields: InputFields<SignupValidationSchema> = [
    {
      label: "E-mail",
      type: "text",
      name: "email",
    },
    {
      label: "Name",
      type: "text",
      name: "name",
    },
    {
      label: "Surname",
      type: "text",
      name: "surname",
    },
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
    {
      label: "Confirm password",
      type: "password",
      name: "confirmPass",
    },
  ];

  return (
    <form id="signupForm" onSubmit={handleSubmit(signup)}>
      <h4>
        What is your <span>name?</span>
      </h4>
      <p>Your name will appear on quotes and your public profile.</p>
      <img src={defaultAvatar} alt="user avatar" />
      {inputFields.map(({ label, type, name }) => (
        <InputField<SignupValidationSchema>
          key={name}
          label={label}
          type={type}
          name={name}
          register={register}
          error={errors[name as Path<SignupValidationSchema>]?.message ?? ""}
        />
      ))}
      <Button type="submit" className="signup w-100" text="Sign up" />
      <p>
        <span>Already have an account?</span>
        <span onClick={() => navigate("/login")}>Sign in</span>
      </p>
    </form>
  );
};

export default SignupForm;
