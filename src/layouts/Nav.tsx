import { useState, type FC, type JSX } from "react";
import "./nav.css";
import { useLocation, useNavigate } from "react-router";
import Button from "../components/Button";
import Hamburger from "../components/Hamburger";

const Nav: FC = () => {
  const [opened, setOpened] = useState<boolean>(false);

  const location = useLocation();

  const navigate = useNavigate();

  const renderNavItems = () => {
    const items: JSX.Element[] = [];

    if (location.pathname !== "/login")
      items.push(
        <Button
          key="loginbtn"
          type="button"
          className="login w-100"
          onClick={() => navigate("/login")}
          text="Login"
        />,
      );

    if (location.pathname !== "/signup")
      items.push(
        <Button
          key="signupbtn"
          type="button"
          className="signup w-100"
          onClick={() => navigate("/signup")}
          text="Signup"
        />,
      );

    return items.map((item) => item);
  };

  return (
    <nav className={opened ? "opened" : ""}>
      <div>
        <Hamburger toggled={opened} onClick={() => setOpened(!opened)} />
        <p onClick={() => navigate("/")}>
          Quote<span>Vote</span>
        </p>
      </div>
      <div>{renderNavItems()}</div>
    </nav>
  );
};

export default Nav;
