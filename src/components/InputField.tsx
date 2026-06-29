import "./input-field.css";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

export type InputFieldProps<T extends FieldValues> = {
  label: string;
  type: "text" | "password" | "file";
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
};

const InputField = <T extends FieldValues>({
  label,
  type,
  name,
  register,
  error,
}: InputFieldProps<T>) => {
  return (
    <div className="input-field" {...(error && { "data-error": error })}>
      <label
        htmlFor={name}
        {...(type === "file" && { className: "file-input-label" })}
      >
        {label}
      </label>
      <input
        id={name}
        type={type}
        {...(type === "file" && { className: "file-input" })}
        {...register(name as Path<T>)}
      />
    </div>
  );
};

export default InputField;
