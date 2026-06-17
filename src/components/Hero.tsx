import { useEffect, useRef, useState, type FC } from "react";
import "./hero.css";
import Button from "./Button";
import { useNavigate } from "react-router";
import QuotesService, { type Quote } from "../api/quotevote/quotes.service";
import QuoteCard from "./QuoteCard";
import QuoteCardSkeleton from "./QuoteCardSkeleton";

const Hero: FC = () => {
  const [mostLikedQuotes, setMostLikedQuotes] = useState<Quote[]>([]);

  const quotesService = useRef(new QuotesService());

  const navigate = useNavigate();

  useEffect(() => {
    const getMostLikedQuotes = async () => {
      const result = await quotesService.current.getQuotes("mostLiked", "", 3);

      if (result instanceof Array) setMostLikedQuotes(result);
    };

    getMostLikedQuotes();
  }, []);

  return (
    <section id="hero">
      <div>
        <h1>
          Welcome <br /> to <span>QuoteVote</span>
        </h1>
        <h5>
          QuoteVote is free online platform for you to explore quips, quotes and
          proverbs. Sign up and express yourself.
        </h5>
        <Button
          type="button"
          text="Sign up"
          className="signup"
          onClick={() => navigate("/signup")}
        />
      </div>
      <div>
        {mostLikedQuotes.length === 0 ? (
          <>
            <QuoteCardSkeleton />
            <QuoteCardSkeleton />
            <QuoteCardSkeleton />
          </>
        ) : (
          mostLikedQuotes.map((quote) => (
            <QuoteCard
              key={quote.id}
              quote={quote.content}
              author={{
                fullname: `${quote.name} ${quote.surname}`,
                avatar: quote.avatar,
              }}
              written={quote.written}
              updated={quote.updated}
              totalVotes={quote.totalVotes}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default Hero;
