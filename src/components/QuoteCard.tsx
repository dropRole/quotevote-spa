import { useEffect, useRef, useState, type FC } from "react";
import "./quote-card.css";
import arrowDown from "../assets/icons/arrow-down.png";
import arrowUp from "../assets/icons/arrow-up.png";
import defaultAvatar from "../assets/icons/default-avatar.png";
import moment from "moment";
import UsersService from "../api/quotevote/users.service";
import QuotesService from "../api/quotevote/quotes.service";
import { useNavigate } from "react-router";

type QuoteCardProps = {
  id: string;
  quote: string;
  author: {
    fullname: string;
    avatar: string | null;
  };
  written: string;
  updated: string | null;
  totalVotes: string;
  votedOn: "up" | "down" | undefined;
  username: string;
};

const QuoteCard: FC<QuoteCardProps> = ({
  id,
  quote,
  author: { fullname, avatar },
  written,
  updated,
  totalVotes,
  votedOn,
  username,
}) => {
  const [votedOnQuote, setVotedOnQuote] = useState<"up" | "down" | undefined>(
    votedOn,
  );
  const [quoteTotalVotes, setQuoteTotalVotes] = useState<number>(
    parseInt(totalVotes),
  );

  const navigate = useNavigate();

  const [userAvatar, setUserAvatar] = useState<Blob | string>(defaultAvatar);

  const usersService = useRef(new UsersService());

  const quotesService = useRef(new QuotesService());

  const upOrDownVote = async (vote: "up" | "down") => {
    const { success } = await quotesService.current.voteOnQuote(id, vote);

    if (!success) return;

    setVotedOnQuote(vote);

    const { data } = await quotesService.current.getQuote(id);

    if (data) setQuoteTotalVotes(parseInt(data.totalVotes));
  };

  const renderQuoteVotes = () => {
    if (votedOnQuote === "up")
      return (
        <div>
          <img src={arrowUp} className="up-vote" alt="like" />
          {quoteTotalVotes}
          <img
            src={arrowDown}
            alt="dislike"
            onClick={() => upOrDownVote("down")}
          />
        </div>
      );

    if (votedOnQuote === "down")
      return (
        <div>
          <img src={arrowDown} alt="like" onClick={() => upOrDownVote("up")} />
          {quoteTotalVotes}
          <img src={arrowUp} className="down-vote" alt="dislike" />
        </div>
      );

    if (votedOnQuote === undefined)
      return (
        <div>
          <img src={arrowDown} alt="like" onClick={() => upOrDownVote("up")} />
          {quoteTotalVotes}
          <img
            src={arrowDown}
            alt="dislike"
            onClick={() => upOrDownVote("down")}
          />
        </div>
      );
  };

  useEffect(() => {
    if (!avatar) return;

    const streamAvatar = async () => {
      const { success, data } = await usersService.current.getAvatar(avatar);

      if (success && data) setUserAvatar(data);
    };

    streamAvatar();
  }, []);

  return (
    <div className="quote-card">
      {renderQuoteVotes()}
      <div>
        <p>{quote}</p>
        <div>
          <p
            onClick={() =>
              navigate(
                `/profile?username=${username}&user_fullname=${fullname}&user_avatar=${avatar}`,
              )
            }
          >
            <img
              src={
                userAvatar instanceof Blob
                  ? URL.createObjectURL(userAvatar)
                  : userAvatar
              }
            />
            <span>{fullname}</span>
          </p>
          <span>
            {moment(updated ? updated : written).format("DD/MM/YYYY")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuoteCard;
