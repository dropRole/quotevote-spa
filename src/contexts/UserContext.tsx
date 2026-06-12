import { createContext } from "react";
import type { User } from "../api/quotevote/users.service";

type UserContext = User | undefined;

const UserContext = createContext<UserContext>(undefined);

export default UserContext;
