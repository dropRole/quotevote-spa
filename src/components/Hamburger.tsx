import type { FC } from "react";
import "./hamburger.css";

type HamburgerProps = {
  toggled: boolean;
  onClick: () => void;
};

const Hamburger: FC<HamburgerProps> = ({ toggled, onClick }) => {
  return (
    <button
      id="hamburger"
      className={`${toggled ? "toggled" : ""}`}
      onClick={onClick}
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
};

export default Hamburger;
