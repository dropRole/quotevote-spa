import type { FC } from "react";
import "./button.css";

type ButtonProps = {
  type: "button" | "submit";
  className: string;
  onClick: () => void;
  text: string;
};

const Button: FC<ButtonProps> = ({ type, className, onClick, text }) => {
  return (
    <button type={type} className={`btn ${className}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
