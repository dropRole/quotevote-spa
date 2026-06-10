import { Route, Routes } from "react-router";
import "./App.css";
import Signup from "./pages/Signup";
import DialogContext from "./contexts/DialogContext";
import { useState } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  const [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false);
  const [alertDialogTitle, setAlertDialogTitle] = useState("");
  const [alertDialogMessage, setAlertDialogMessage] = useState("");

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
      <Routes>
        <Route index element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </DialogContext.Provider>
  );
}

export default App;
