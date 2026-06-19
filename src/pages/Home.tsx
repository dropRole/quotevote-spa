import { useEffect, useRef, useState, type FC } from "react";
import Hero from "../components/Hero";
import Nav from "../layouts/Nav";
import Footer from "../layouts/Footer";
import "./home.css";
import QuoteCardBox from "../layouts/QuoteCardBox";
import SettingsDialog from "../components/SettingsDialog";
import AlertDialog from "../components/AlertDialog";
import useUserInfo from "../hooks/useUserInfo";
import QuoteCreationDialog from "../components/QuoteCreationDialog";
import QuotesService, { type Quote } from "../api/quotevote/quotes.service";
import QuoteCard from "../components/QuoteCard";
import QuoteCardSkeleton from "../components/QuoteCardSkeleton";

const Home: FC = () => {
  const [randomQuote, setRandomQuote] = useState<Quote | undefined>(undefined);

  useUserInfo();

  const isLoggedInUser = localStorage.getItem("quotevote-session");

  const quotesService = useRef(new QuotesService());

  useEffect(() => {
    if (!isLoggedInUser) return;

    const fetchRandomQuote = async () => {
      const { success, data } = await quotesService.current.getRandomQuote();

      if (success && data) setRandomQuote(data);
    };

    fetchRandomQuote();
  }, []);

  return (
    <>
      <Nav />
      {!isLoggedInUser && (
        <>
          <Hero />
          <h2>
            Explore the world of <br />
            <span>fantastic quotes</span>
          </h2>
        </>
      )}
      {isLoggedInUser && (
        <div id="randomQuote">
          <h5>Quote of the day</h5>
          <p>Quote of the day is randomly chosen quote.</p>
          {randomQuote ? (
            <QuoteCard
              quote={randomQuote.content}
              author={{
                fullname: `${randomQuote.name} ${randomQuote.surname}`,
                avatar: randomQuote.avatar,
              }}
              written={randomQuote.written}
              updated={randomQuote.updated}
              totalVotes={randomQuote.totalVotes}
            />
          ) : (
            <QuoteCardSkeleton />
          )}
        </div>
      )}
      <QuoteCardBox
        headline="Most liked quotes"
        subheadline="Login to see more most liked quotes"
        searchFor="mostLiked"
      />
      {isLoggedInUser && <SettingsDialog />}
      {isLoggedInUser && <QuoteCreationDialog />}
      <AlertDialog />
      <Footer />
    </>
  );
};

export default Home;
