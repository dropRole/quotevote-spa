import type { FC } from "react";
import "./footer.css";
import logoWhite from "../assets/icons/logo-medium-white.png";
import moment from "moment";

const Footer: FC = () => {
  return (
    <footer>
      <img src={logoWhite} alt="logo white" />
      <p>All rights reserved | {moment().format("YYYY")}</p>
    </footer>
  );
};

export default Footer;
