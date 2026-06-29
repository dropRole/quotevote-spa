import { useContext, useEffect, useRef, useState, type FC } from "react";
import "./profile.css";
import Nav from "../layouts/Nav";
import Footer from "../layouts/Footer";
import { UserContext } from "../contexts/UserContext";
import { useLocation, useSearchParams } from "react-router";
import defaultAvatar from "../assets/icons/default-avatar.png";
import { depictUserAvatar } from "../utils/functions";
import useUserInfo from "../hooks/useUserInfo";
import UsersService from "../api/quotevote/users.service";
import QuotesService, { type Quote } from "../api/quotevote/quotes.service";
import SettingsDialog from "../components/SettingsDialog";
import QuoteCreationDialog from "../components/QuoteCreationDialog";
import QuoteCardBox from "../layouts/QuoteCardBox";
import AlertDialog from "../components/AlertDialog";
import ConfirmationDialog from "../components/ConfirmationDialog";

const Profile: FC = () => {
  const [profileAvatar, setProfileAvatar] = useState<Blob | string>(
    defaultAvatar,
  );
  const [profileFullname, setProfileFullname] = useState<string>("");
  const [quoteCount, setQuoteCount] = useState<number>(0);
  const [quoteKarma, setQuoteKarma] = useState<number>(0);

  const [mostLikedQuotes, setMostLikedQuotes] = useState<Quote[]>([]);
  const [leastLikedQuotes, setLeastLikedQuotes] = useState<Quote[]>([]);
  const [recentQuotes, setRecentLikedQuotes] = useState<Quote[]>([]);

  useUserInfo();

  const userContext = useContext(UserContext);

  const location = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();

  const usersService = useRef(new UsersService());

  const quotesService = useRef(new QuotesService());

  const fetchQuoteKarma = async (username: string) => {
    const { success, data } =
      await quotesService.current.getQuoteKarma(username);

    if (success && data) {
      setQuoteCount(data.quotes);

      setQuoteKarma(data.karma);
    }
  };

  useEffect(() => {
    (async () => {
      const username = new URLSearchParams(location.search).get("username");

      if (userContext.user && !username) {
        setProfileFullname(
          `${userContext.user.name} ${userContext.user.surname}`,
        );

        setProfileAvatar(userContext.user.avatar);

        fetchQuoteKarma(userContext.user.username);

        return;
      }

      const userFullname = new URLSearchParams(location.search).get(
        "user_fullname",
      );

      if (userFullname) setProfileFullname(userFullname);

      const userAvatar = new URLSearchParams(location.search).get(
        "user_avatar",
      );

      if (!userAvatar) return;

      const { success, data } =
        await usersService.current.getAvatar(userAvatar);

      if (success && data) setProfileAvatar(data);

      if (username) fetchQuoteKarma(username);
    })();
  }, [userContext, searchParams]);

  return (
    <>
      <Nav />
      <section id="profileReview">
        <div>
          {depictUserAvatar(profileAvatar)}
          <h5>{profileFullname}</h5>
        </div>
        <div>
          <div>
            <span>Quotes</span>
            <span>{quoteCount}</span>
          </div>
          <div>
            <span>Quotes karma</span>
            <span>{quoteKarma}</span>
          </div>
        </div>
      </section>
      <section id="personalQuotes">
        <QuoteCardBox
          headline="Most liked"
          subheadline=""
          searchFor="mostLiked"
          author={searchParams.get("username") ?? userContext?.user?.username}
        />
        <QuoteCardBox
          headline="Least liked"
          subheadline=""
          searchFor="leastLiked"
          author={searchParams.get("username") ?? userContext?.user?.username}
        />
        <QuoteCardBox
          headline="Recent"
          subheadline=""
          searchFor="recent"
          author={searchParams.get("username") ?? userContext?.user?.username}
        />
      </section>
      <AlertDialog />
      <SettingsDialog />
      <QuoteCreationDialog />
      <ConfirmationDialog />
      <Footer />
    </>
  );
};

export default Profile;
