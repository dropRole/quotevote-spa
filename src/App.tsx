import { Route, Routes } from "react-router";
import "./App.css";
import Signup from "./pages/Signup";
import DialogContext from "./contexts/DialogContext";
import { useEffect, useRef, useState } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import UserContext from "./contexts/UserContext";
import UsersService, { type User } from "./api/quotevote/users.service";

function App() {
  const [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false);
  const [alertDialogTitle, setAlertDialogTitle] = useState("");
  const [alertDialogMessage, setAlertDialogMessage] = useState("");

  const [user, setUser] = useState<User | undefined>(undefined);

  const usersService = useRef(new UsersService());

  const getUserInfo = async () => {
    const result = await usersService.current.getInfo();

    if (result.data) setUser(result.data);
  };

  const isLoggedInUser = localStorage.getItem("quotevote-session");

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <DialogContext.Provider
      value={{
        alertDialog: {
          open: alertDialogOpen,
          setOpen: setAlertDialogOpen,
          title: alertDialogTitle,
          setTitle: setAlertDialogTitle,
          message: alertDialogMessage,
          setMessage: setAlertDialogMessage,
        },
      }}
    >
      <UserContext.Provider value={user}>
        <Routes>
          <Route index element={<Home />} />
          {!isLoggedInUser && <Route path="/signup" element={<Signup />} />}
          {!isLoggedInUser && <Route path="/login" element={<Login />} />}
        </Routes>
      </UserContext.Provider>
    </DialogContext.Provider>
  );
}

export default App;
