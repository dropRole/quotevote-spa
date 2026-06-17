import { Route, Routes } from "react-router";
import "./App.css";
import Signup from "./pages/Signup";
import DialogContext from "./contexts/DialogContext";
import { useState } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { UserContext, type LoggedInUser } from "./contexts/UserContext";

function App() {
  const [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false);
  const [alertDialogTitle, setAlertDialogTitle] = useState("");
  const [alertDialogMessage, setAlertDialogMessage] = useState("");

  const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);

  const [user, setUser] = useState<LoggedInUser | undefined>(undefined);

  const isLoggedInUser = localStorage.getItem("quotevote-session");

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
        settingsDialog: {
          open: settingsDialogOpen,
          setOpen: setSettingsDialogOpen,
        },
      }}
    >
      <UserContext.Provider value={{ user, setUser }}>
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
