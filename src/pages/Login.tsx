import { type FC } from "react";
import Nav from "../layouts/Nav";
import AlertDialog from "../components/AlertDialog";
import Footer from "../layouts/Footer";
import LoginForm from "../components/LoginForm";

const Login: FC = () => {
  return (
    <>
      <Nav />
      <LoginForm />
      <AlertDialog />
      <Footer />
    </>
  );
};

export default Login;
