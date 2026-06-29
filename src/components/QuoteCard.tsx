import {
  useContext,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type FC,
  type SetStateAction,
} from "react";
import "./quote-card.css";
import arrowDown from "../assets/icons/arrow-down.png";
import arrowUp from "../assets/icons/arrow-up.png";
import defaultAvatar from "../assets/icons/default-avatar.png";
import settings from "../assets/icons/settings.png";
import moment from "moment";
import UsersService from "../api/quotevote/users.service";
import QuotesService, { type Quote } from "../api/quotevote/quotes.service";
import { useLocation, useNavigate } from "react-router";
import { UserContext } from "../contexts/UserContext";
import DialogContext from "../contexts/DialogContext";

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
  setEditedOrDeletedQuote?: Dispatch<
    SetStateAction<Pick<Quote, "id"> | undefined>
  >;
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
  setEditedOrDeletedQuote,
}) => {
  const [votedOnQuote, setVotedOnQuote] = useState<"up" | "down" | undefined>(
    votedOn,
  );
  const [quoteTotalVotes, setQuoteTotalVotes] = useState<number>(
    parseInt(totalVotes),
  );

  const [userAvatar, setUserAvatar] = useState<Blob | string>(defaultAvatar);

  const userContext = useContext(UserContext);

  const { quoteCreationDialog, confirmationDialog, alertDialog } =
    useContext(DialogContext);

  const navigate = useNavigate();

  const location = useLocation();

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

  const searchParams = new URLSearchParams(location.search);

  const deleteQuote = async (id: string) => {
    alertDialog?.setOpen(true);

    const { message } = await quotesService.current.unQuote(id);

    if (message && alertDialog) {
      alertDialog?.setTitle("Quote deletion");

      alertDialog?.setMessage(message);

      confirmationDialog?.setOpen(false);

      if (setEditedOrDeletedQuote) setEditedOrDeletedQuote(id);
    }
  };

  const renderQuoteSettings = () => {
    if (
      location.pathname === "/profile" &&
      (!searchParams.get("username") ||
        searchParams.get("username") === userContext?.user?.username)
    )
      return (
        <div className="quote-settings">
          <img
            src={settings}
            alt="quote settings"
            onClick={() => {
              quoteCreationDialog?.setQuoteToEdit({
                id,
                content: quote,
              });

              if (setEditedOrDeletedQuote)
                quoteCreationDialog?.setAfterEditAction(() => () => {
                  setEditedOrDeletedQuote(id);

                  const timeoutId = setTimeout(() => {
                    setEditedOrDeletedQuote(undefined);

                    clearTimeout(timeoutId);
                  }, 1000);
                });

              quoteCreationDialog?.setOpen(true);
            }}
          />
          <div
            onClick={() => {
              confirmationDialog?.setTitle("Quote deletion");
              confirmationDialog?.setIssue(
                "Are you sure you want to delete the quote?",
              );
              confirmationDialog?.setOpen(true);
              confirmationDialog?.setConfirmedAction(
                () => () => deleteQuote(id),
              );
            }}
          >
            <span></span>
            <span></span>
          </div>
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
      {renderQuoteSettings()}
    </div>
  );
};

export default QuoteCard;
