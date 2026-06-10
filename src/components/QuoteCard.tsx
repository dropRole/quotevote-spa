import type { FC } from "react";
import "./quote-card.css";
import arrowDown from "../assets/icons/arrow-down.png";
import defaultAvatar from "../assets/icons/default-avatar.png";
import moment from "moment";

type QuoteCardProps = {
  quote: string;
  author: {
    fullname: string;
    avatar: string | null;
  };
  written: string;
  updated: string | null;
  totalVotes: number;
};

const QuoteCard: FC<QuoteCardProps> = ({
  quote,
  author: { fullname, avatar },
  written,
  updated,
  totalVotes,
}) => {
  return (
    <div className="quote-card">
      <div>
        <img src={arrowDown} alt="like" />
        {totalVotes}
        <img src={arrowDown} alt="dislike" />
      </div>
      <div>
        <p>{quote}</p>
        <div>
          <p>
            <img src={avatar ?? defaultAvatar} />
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
