import type { FC } from "react";
import Hero from "../components/Hero";
import Nav from "../layouts/Nav";
import Footer from "../layouts/Footer";

const Home: FC = () => {
  return (
    <>
      <Nav />
      <Hero />
      <Footer />
    </>
  );
};

export default Home;
