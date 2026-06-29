import { createContext, type Dispatch, type SetStateAction } from "react";
import type { User } from "../api/quotevote/users.service";

type LoggedInUser = Omit<User, "avatar"> & { avatar: Blob | string };

type UserContext = {
  user?: LoggedInUser;
  setUser?: Dispatch<SetStateAction<LoggedInUser | undefined>>;
};

const UserContext = createContext<UserContext>({});

export { type LoggedInUser, UserContext };
