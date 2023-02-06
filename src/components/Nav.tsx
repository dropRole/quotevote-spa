import { useEffect, useRef, useState } from "react";
import { TextButton } from "./TextButton";
import "./nav.css";
import logo from "../assets/icons/logo-orange.png";
import { HamburgerButton } from "./HamburgerButton";
import { AddButton } from "./AddButton";
import chevron from "../assets/icons/chevron.png";
import colouredChevron from "../assets/icons/chevron-coloured.png";
import { IUser } from "../App";
import { getUserAvatar } from "../services/users/users-get";
import defaultAvatar from "../assets/icons/man.png";

interface INavProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  user: IUser;
}

export const Nav: React.FC<INavProps> = ({ collapsed, setCollapsed, user }) => {
  const [avatar, setAvatar] = useState<Blob | string>(defaultAvatar);

  useEffect(() => {
    const streamUserAvatar = async () => {
      const stream = await getUserAvatar(user.avatar as string);
      setAvatar(stream);
    };

    // if user avatar is defined
    if (user.avatar !== undefined) streamUserAvatar();
  }, [user.avatar]);

  const nav: React.RefObject<HTMLElement> = useRef<HTMLElement>(null);

  const toolbar: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const hamBtn: React.RefObject<HTMLButtonElement> =
    useRef<HTMLButtonElement>(null);

  const addBtn: React.RefObject<HTMLButtonElement> =
    useRef<HTMLButtonElement>(null);

  const pInscription: React.RefObject<HTMLParagraphElement> =
    useRef<HTMLParagraphElement>(null);

  // controls navbar collapsing setup
  const collapseNavbar: Function = () => {
    setTimeout(() => {
      // if nav ref instantiated
      if (nav.current) {
        nav.current.style.flexDirection = !collapsed ? "column" : "row";
        nav.current
          .querySelector("div#inscription")
          ?.classList.toggle("flex-basis-10");
        nav.current
          .querySelector("div#inscription")
          ?.classList.toggle("flex-basis-100");
      }

      // if toolbar ref instantiated
      if (toolbar.current)
        toolbar.current.querySelectorAll("div").forEach((el) => {
          el.classList.toggle("d-flex");
        });
    }, 350);

    // if hamBtn ref instantiated
    if (hamBtn.current)
      !collapsed
        ? hamBtn.current.classList.add("btn-hamburger-open")
        : hamBtn.current.classList.remove("btn-hamburger-open");

    // if pInscription ref instantiated
    if (pInscription.current)
      !collapsed
        ? (pInscription.current.style.opacity = "0")
        : (pInscription.current.style.opacity = "1");

    // if addBtn ref instantiated
    if (addBtn.current)
      !collapsed
        ? (addBtn.current.style.opacity = "0")
        : (addBtn.current.style.opacity = "1");

    // if toolbar ref instantiated
    if (toolbar.current)
      toolbar.current.querySelectorAll("div").forEach((el) => {
        el.classList.toggle("opacity-1");
      });

    setCollapsed(!collapsed);

    return;
  };
  return (
    <nav ref={nav}>
      <div
        id="inscription"
        className={!localStorage.getItem("JWT") ? "flex-basis-100" : ""}
      >
        <HamburgerButton domRef={hamBtn} clickAction={collapseNavbar} />
        <p ref={pInscription} onClick={() => (window.location.href = "/")}>
          Quote vote <img src={logo} alt="logo"></img>
        </p>
      </div>
      <div id="toolbar" ref={toolbar}>
        {localStorage.getItem("JWT") ? (
          <>
            <AddButton domRef={addBtn} clickAction={Function} />
            <div
              id="profileAvatar"
              onClick={() =>
                (window.location.href = `/profile?username=${
                  user.username
                }&fullname=${`${user.name} ${user.surname}`}&avatar=${
                  typeof avatar === "string" ? "default" : user.avatar
                }`)
              }
            >
              <img
                src={
                  typeof avatar === "string"
                    ? avatar
                    : URL.createObjectURL(avatar)
                }
                className="avatar"
                alt="avatar"
              />
              {user.username}
            </div>
            <div onClick={() => (window.location.href = "/")}>
              <span>Home</span>
              <img src={chevron} className="right-chevron" alt=">" />
            </div>
            <div>
              <span>Settings</span>
              <img src={chevron} className="right-chevron" alt=">" />
            </div>
            <div
              onClick={() => {
                localStorage.removeItem("JWT");

                window.location.href = "/login";
              }}
            >
              <span className="color-primary">Logout</span>
              <img src={colouredChevron} className="right-chevron" alt=">" />
            </div>
          </>
        ) : (
          <>
            {window.location.pathname !== "/signup" && (
              <div className="justify-center">
                <TextButton
                  btn="btn-text btn-signup"
                  text="Sign up"
                  clickAction={() => (window.location.href = "/signup")}
                />
              </div>
            )}
            {window.location.pathname !== "/login" && (
              <div className="justify-center">
                <TextButton
                  btn="btn-text btn-outline"
                  text="Login"
                  clickAction={() => (window.location.href = "/login")}
                />
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};
