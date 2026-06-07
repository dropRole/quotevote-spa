import "./input-field.css";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

export type InputFieldProps<T extends FieldValues> = {
  label: string;
  type: "text" | "password";
  name: string;
  register: UseFormRegister<T>;
  error: string;
};

const InputField = <T extends FieldValues>({
  label,
  type,
  name,
  register,
  error,
}: InputFieldProps<T>) => {
  return (
    <div className="input-field" data-error={error}>
      <label htmlFor={name}>{label}</label>
      <input id={name} type={type} {...register(name as Path<T>)} />
    </div>
  );
};

export default InputField;
