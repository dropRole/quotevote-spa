import { useContext, useState, type FC, type JSX } from "react";
import "./nav.css";
import { useLocation, useNavigate } from "react-router";
import Button from "../components/Button";
import Hamburger from "../components/Hamburger";
import { UserContext } from "../contexts/UserContext";
import { depictUserAvatar } from "../utils/functions";
import DialogContext from "../contexts/DialogContext";

const Nav: FC = () => {
  const [opened, setOpened] = useState<boolean>(false);

  const location = useLocation();

  const userContext = useContext(UserContext);

  const dialogContext = useContext(DialogContext);

  const navigate = useNavigate();

  const isLoggedInUser = localStorage.getItem("quotevote-session");

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
        <span
          key="settings-item"
          onClick={() => dialogContext.settingsDialog?.setOpen(true)}
        >
          Settings
        </span>,
        <span key="logout-item">Logout</span>,
        <div
          key="avatar-item"
          data-user-fullname={`${userContext?.user?.name} ${userContext?.user?.surname}`}
        >
          {userContext &&
            userContext.user &&
            depictUserAvatar(userContext?.user?.avatar)}
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
        {isLoggedInUser && (
          <div>
            <span></span>
            <span></span>
          </div>
        )}
      </div>
      <div>{renderNavItems()}</div>
    </nav>
  );
};

export default Nav;
