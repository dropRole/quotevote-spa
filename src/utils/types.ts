import type { Path } from "react-hook-form";

type InputField<T> = {
  label: string;
  type: "text" | "password";
  name: Path<T>;
};

type InputFields<T> = InputField<T>[];

export { type InputFields };
