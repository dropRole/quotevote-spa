import { type FC } from "react";
import Nav from "../layouts/Nav";
import SignupForm from "../components/SignupForm";
import AlertDialog from "../components/AlertDialog";

const Signup: FC = () => {
  return (
    <>
      <Nav />
      <SignupForm />
      <AlertDialog />
    </>
  );
};

export default Signup;
