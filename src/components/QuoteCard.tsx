import { useEffect, useRef, useState, type FC } from "react";
import "./quote-card.css";
import arrowDown from "../assets/icons/arrow-down.png";
import defaultAvatar from "../assets/icons/default-avatar.png";
import moment from "moment";
import UsersService from "../api/quotevote/users.service";

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
  const [userAvatar, setUserAvatar] = useState<Blob | string>(defaultAvatar);

  const usersService = useRef(new UsersService());

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
      <div>
        <img src={arrowDown} alt="like" />
        {totalVotes}
        <img src={arrowDown} alt="dislike" />
      </div>
      <div>
        <p>{quote}</p>
        <div>
          <p>
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
