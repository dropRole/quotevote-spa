import { useEffect, useRef, useState, type FC } from "react";
import QuotesService, { type Quote } from "../api/quotevote/quotes.service";
import "./quote-card-box.css";
import QuoteCard from "../components/QuoteCard";
import Button from "../components/Button";
import { useNavigate } from "react-router";
import { isUserLoggedIn } from "../utils/functions";

type QuoteCardBoxProps = {
  headline: string;
  subheadline: string;
  searchFor: "mostLiked" | "leastLiked" | "recent";
  author?: string;
};

const QuoteCardBox: FC<QuoteCardBoxProps> = ({
  headline,
  subheadline,
  searchFor,
  author,
}) => {
  const [quoteLimit, setQuoteLimit] = useState(9);
  const [quoteLimitReached, setQuoteLimitReached] = useState<boolean>(false);
  const [boxQuoteColumns, setBoxQuoteColumns] = useState<{
    [key in 0 | 1 | 2]: Quote[];
  }>({ 0: [], 1: [], 2: [] });
  const [editedOrDeletedQuote, setEditedOrDeletedQuote] = useState<
    Pick<Quote, "id"> | undefined
  >(undefined);

  const quotesService = useRef(new QuotesService());

  const navigate = useNavigate();

  const renderQuoteColumns = () => {
    return Object.keys(boxQuoteColumns).map((key) => (
      <div key={key} className="quote-box-column">
        {boxQuoteColumns[key as unknown as 0 | 1 | 2].map(
          ({
            id,
            content,
            name,
            surname,
            avatar,
            written,
            updated,
            totalVotes,
            votedOn,
            username,
          }) => (
            <QuoteCard
              key={id}
              id={id}
              quote={content}
              author={{ fullname: name + surname, avatar }}
              written={written}
              updated={updated}
              totalVotes={totalVotes}
              votedOn={votedOn}
              username={username}
              setEditedOrDeletedQuote={setEditedOrDeletedQuote}
            />
          ),
        )}
      </div>
    ));
  };

  useEffect(() => {
    const getFilteredQuotes = async () => {
      const result = await quotesService.current.getQuotes(
        searchFor,
        quoteLimit,
        author,
      );

      if (
        result instanceof Array &&
        result.length ===
          boxQuoteColumns[0].length +
            boxQuoteColumns[1].length +
            boxQuoteColumns[2].length
      )
        setQuoteLimitReached(true);

      if (result instanceof Array) {
        const columns: typeof boxQuoteColumns = { 0: [], 1: [], 2: [] };

        for (let i = 0, j = 0; i < result.length; i++, j++) {
          if (j === 3) j = 0;

          columns[j as unknown as keyof typeof columns].push(result[i]);
        }

        setBoxQuoteColumns(columns);
      }
    };

    getFilteredQuotes();
  }, [quoteLimit]);

  useEffect(() => {
    const getFilteredQuotes = async () => {
      const result = await quotesService.current.getQuotes(
        searchFor,
        quoteLimit,
        author,
      );

      if (result instanceof Array) {
        const columns: typeof boxQuoteColumns = { 0: [], 1: [], 2: [] };

        for (let i = 0, j = 0; i < result.length; i++, j++) {
          if (j === 3) j = 0;

          columns[j as unknown as keyof typeof columns].push(result[i]);
        }

        setBoxQuoteColumns(columns);
      }
    };

    getFilteredQuotes();
  }, [editedOrDeletedQuote]);

  const renderQuoteLoadButton = () => {
    if (isUserLoggedIn() && !quoteLimitReached)
      return (
        <Button
          type="button"
          text="Load more"
          className="login"
          onClick={() => setQuoteLimit(quoteLimit + 3)}
        />
      );

    if (isUserLoggedIn() && quoteLimitReached) return <></>;

    return (
      <Button
        type="button"
        text="Login for more"
        className="login"
        onClick={() => navigate("/login")}
      />
    );
  };

  return (
    <section className="quote-card-box">
      <h5>{headline}</h5>
      <p>{subheadline}</p>
      <div>{renderQuoteColumns()}</div>
      {renderQuoteLoadButton()}
    </section>
  );
};

export default QuoteCardBox;
