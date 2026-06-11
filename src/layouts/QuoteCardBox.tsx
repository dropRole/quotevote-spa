import { useEffect, useRef, useState, type FC } from "react";
import QuotesService, { type Quote } from "../api/quotevote/quotes.service";
import "./quote-card-box.css";
import QuoteCard from "../components/QuoteCard";
import Button from "../components/Button";
import { useNavigate } from "react-router";

type QuoteCardBoxProps = {
  headline: string;
  subheadline: string;
  searchFor: "mostLiked" | "leastLiked" | "recent";
};

const QuoteCardBox: FC<QuoteCardBoxProps> = ({
  headline,
  subheadline,
  searchFor,
}) => {
  const [quoteLimit, setQuoteLimit] = useState(9);
  const [boxQuoteColumns, setBoxQuoteColumns] = useState<{
    [key in 0 | 1 | 2]: Quote[];
  }>({ 0: [], 1: [], 2: [] });

  const quotesService = useRef(new QuotesService());

  const navigate = useNavigate();

  const getFilteredQuotes = async () => {
    const result = await quotesService.current.getQuotes(
      searchFor,
      "",
      quoteLimit,
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
          }) => (
            <QuoteCard
              key={id}
              quote={content}
              author={{ fullname: name + surname, avatar }}
              written={written}
              updated={updated}
              totalVotes={totalVotes}
            />
          ),
        )}
      </div>
    ));
  };

  useEffect(() => {
    getFilteredQuotes();
  }, []);

  return (
    <section className="quote-card-box">
      <h5>{headline}</h5>
      <p>{subheadline}</p>
      <div>{renderQuoteColumns()}</div>
      <Button
        type="button"
        text="Login for more"
        className="login"
        onClick={() => navigate("/login")}
      />
    </section>
  );
};

export default QuoteCardBox;
