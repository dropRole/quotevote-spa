import { type FC } from "react";
import Nav from "../layouts/Nav";
import SignupForm from "../components/SignupForm";
import AlertDialog from "../components/AlertDialog";
import Footer from "../layouts/Footer";

const Signup: FC = () => {
  return (
    <>
      <Nav />
      <SignupForm />
      <AlertDialog />
      <Footer />
    </>
  );
};

export default Signup;
