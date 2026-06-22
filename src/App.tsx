import { Route, Routes } from "react-router";
import "./App.css";
import Signup from "./pages/Signup";
import DialogContext from "./contexts/DialogContext";
import { useState } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { UserContext, type LoggedInUser } from "./contexts/UserContext";
import { isUserLoggedIn } from "./utils/functions";

function App() {
  const [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false);
  const [alertDialogTitle, setAlertDialogTitle] = useState("");
  const [alertDialogMessage, setAlertDialogMessage] = useState("");

  const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);

  const [quoteCreationDialogOpen, setQuoteCreationDialogOpen] =
    useState<boolean>(false);

  const [user, setUser] = useState<LoggedInUser | undefined>(undefined);

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
        quoteCreationDialog: {
          open: quoteCreationDialogOpen,
          setOpen: setQuoteCreationDialogOpen,
        },
      }}
    >
      <UserContext.Provider value={{ user, setUser }}>
        <Routes>
          <Route index element={<Home />} />
          {!isUserLoggedIn() && <Route path="/signup" element={<Signup />} />}
          {!isUserLoggedIn() && <Route path="/login" element={<Login />} />}
        </Routes>
      </UserContext.Provider>
    </DialogContext.Provider>
  );
}

export default App;
