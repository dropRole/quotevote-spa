import { useContext, useState, type FC, type JSX } from "react";
import "./nav.css";
import { useLocation, useNavigate } from "react-router";
import Button from "../components/Button";
import Hamburger from "../components/Hamburger";
import UserContext from "../contexts/UserContext";
import defaultAvatar from "../assets/icons/default-avatar.png";

const Nav: FC = () => {
  const [opened, setOpened] = useState<boolean>(false);

  const location = useLocation();

  const isLoggedInUser = localStorage.getItem("quotevote-session");

  const userContext = useContext(UserContext);

  const navigate = useNavigate();

  const renderNavItems = () => {
    const items: JSX.Element[] = [];

    if (location.pathname !== "/login" && !isLoggedInUser)
      items.push(
        <Button
          key="loginbtn"
          type="button"
          className="login w-100"
          onClick={() => navigate("/login")}
          text="Login"
        />,
      );

    if (location.pathname !== "/signup" && !isLoggedInUser)
      items.push(
        <Button
          key="signupbtn"
          type="button"
          className="signup w-100"
          onClick={() => navigate("/signup")}
          text="Signup"
        />,
      );

    if (location.pathname === "/" && isLoggedInUser)
      items.push([
        <span key="settings-item">Settings</span>,
        <span key="logout-item">Logout</span>,
        <div
          key="avatar-item"
          data-user-fullname={`${userContext?.name} ${userContext?.surname}`}
        >
          <img src={userContext?.avatar ?? defaultAvatar} alt="user avatar" />
        </div>,
        <div key="plus-item">
          <span></span>
          <span></span>
        </div>,
      ]);

    return items.map((item) => item);
  };

  return (
    <nav className={opened ? "opened" : ""}>
      <div>
        <Hamburger toggled={opened} onClick={() => setOpened(!opened)} />
        <p onClick={() => navigate("/")}>
          Quote<span>Vote</span>
        </p>
        <div>
          <span></span>
          <span></span>
        </div>
      </div>
      <div>{renderNavItems()}</div>
    </nav>
  );
};

export default Nav;
