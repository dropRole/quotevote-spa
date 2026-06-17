import type { FC } from "react";
import Hero from "../components/Hero";
import Nav from "../layouts/Nav";
import Footer from "../layouts/Footer";
import "./home.css";
import QuoteCardBox from "../layouts/QuoteCardBox";
import SettingsDialog from "../components/SettingsDialog";
import AlertDialog from "../components/AlertDialog";
import useUserInfo from "../hooks/useUserInfo";

const Home: FC = () => {
  const isLoggedInUser = localStorage.getItem("quotevote-session");

  useUserInfo();

  return (
    <>
      <Nav />
      <Hero />
      <h2>
        Explore the world of <br />
        <span>fantastic quotes</span>
      </h2>
      <QuoteCardBox
        headline="Most liked quotes"
        subheadline="Login to see more most liked quotes"
        searchFor="mostLiked"
      />
      {isLoggedInUser && <SettingsDialog />}
      <AlertDialog />
      <Footer />
    </>
  );
};

export default Home;
