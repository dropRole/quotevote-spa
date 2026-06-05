import { Route, Routes } from "react-router";
import "./App.css";
import Signup from "./pages/Signup";

function App() {
  return <Routes>
    <Route path="/signup" element={<Signup />} />
  </Routes>;
}

export default App;
