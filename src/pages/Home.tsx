import type { FC } from "react";
import Hero from "../components/Hero";
import Nav from "../layouts/Nav";
import Footer from "../layouts/Footer";
import "./home.css";
import QuoteCardBox from "../layouts/QuoteCardBox";

const Home: FC = () => {
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
      <Footer />
    </>
  );
};

export default Home;
