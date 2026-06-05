import { useState, type FC, type JSX } from "react";
import "./nav.css";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import Hamburger from "../components/Hamburger";

const Nav: FC = () => {
  const [opened, setOpened] = useState<boolean>(false);

  const navigate = useNavigate();

  const items: JSX.Element[] = [
    <Button
      key="loginbtn"
      type="button"
      className="login w-100"
      onClick={() => navigate("/login")}
      text="Login"
    />,
  ];

  return (
    <nav className={opened ? "opened" : ""}>
      <div>
        <Hamburger toggled={opened} onClick={() => setOpened(!opened)} />
        <p onClick={() => navigate("/")}>
          Quote<span>Vote</span>
        </p>
      </div>
      <div>{items.map((item) => item)}</div>
    </nav>
  );
};

export default Nav;
