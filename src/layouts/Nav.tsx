import { useContext, useRef, useState, type FC, type JSX } from "react";
import "./nav.css";
import { useLocation, useNavigate } from "react-router";
import Button from "../components/Button";
import Hamburger from "../components/Hamburger";
import { UserContext } from "../contexts/UserContext";
import { depictUserAvatar, isUserLoggedIn } from "../utils/functions";
import DialogContext from "../contexts/DialogContext";
import UsersService from "../api/quotevote/users.service";

const Nav: FC = () => {
  const [opened, setOpened] = useState<boolean>(false);

  const location = useLocation();

  const userContext = useContext(UserContext);

  const { alertDialog, settingsDialog, quoteCreationDialog } =
    useContext(DialogContext);

  const navigate = useNavigate();

  const usersService = useRef(new UsersService());

  const logout = async () => {
    if (
      !userContext.user ||
      !userContext.setUser ||
      !alertDialog ||
      !alertDialog.setTitle ||
      !alertDialog.setMessage
    )
      return;

    alertDialog?.setOpen(true);

    const { success, message } = await usersService.current.logout();

    if (!success && message) {
      alertDialog?.setTitle("Logout");
      alertDialog?.setMessage(message);
    }

    if (success) {
      userContext.setUser(undefined);

      localStorage.removeItem("quotevote-session");

      navigate("/login");

      alertDialog?.setOpen(false);
    }
  };

  const renderNavItems = () => {
    const items: JSX.Element[] = [];

    if (location.pathname !== "/login" && !isUserLoggedIn())
      items.push(
        <Button
          key="loginbtn"
          type="button"
          className="login w-100"
          onClick={() => navigate("/login")}
          text="Login"
        />,
      );

    if (location.pathname !== "/signup" && !isUserLoggedIn())
      items.push(
        <Button
          key="signupbtn"
          type="button"
          className="signup w-100"
          onClick={() => navigate("/signup")}
          text="Signup"
        />,
      );

    if (
      (location.pathname === "/" || location.pathname === "/profile") &&
      isUserLoggedIn()
    )
      items.push([
        <span key="settings-item" onClick={() => settingsDialog?.setOpen(true)}>
          Settings
        </span>,
        <span key="logout-item" onClick={() => logout()}>
          Logout
        </span>,
        <div
          key="avatar-item"
          data-user-fullname={`${userContext?.user?.name} ${userContext?.user?.surname}`}
          onClick={() => navigate("/profile")}
        >
          {userContext.user && depictUserAvatar(userContext?.user?.avatar)}
        </div>,
        <div
          key="plus-item"
          onClick={() => {
            quoteCreationDialog?.setQuoteToEdit(undefined);
            quoteCreationDialog?.setOpen(true);
          }}
        >
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
        {isUserLoggedIn() && (
          <div
            onClick={() => {
              quoteCreationDialog?.setQuoteToEdit(undefined);
              quoteCreationDialog?.setOpen(true);
            }}
          >
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
