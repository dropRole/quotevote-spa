import { Route, Routes } from "react-router";
import "./App.css";
import Signup from "./pages/Signup";
import DialogContext from "./contexts/DialogContext";
import { useState } from "react";

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
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </DialogContext.Provider>
  );
}

export default App;
