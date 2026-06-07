import type { FC } from "react";
import Nav from "../layouts/Nav";
import SignupForm from "../components/SignupForm";

const Signup: FC = () => {
  return (
    <>
      <Nav />
      <SignupForm />
    </>
  );
};

export default Signup;
