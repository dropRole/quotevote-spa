import { useContext, useEffect, useRef } from "react";
import { UserContext } from "../contexts/UserContext";
import UsersService from "../api/quotevote/users.service";
import defaultAvatar from "../assets/icons/default-avatar.png";

const useUserInfo = () => {
  const usersService = useRef(new UsersService());

  const userContext = useContext(UserContext);

  const getUserInfo = async () => {
    if (!userContext || !userContext?.setUser) return;

    const { data: userInfo } = await usersService.current.getInfo();

    if (!userInfo) return;

    if (!userInfo.avatar) {
      userContext.setUser({ ...userInfo, avatar: defaultAvatar });

      return;
    }

    const { data: streamedAvatar } = await usersService.current.getAvatar(
      userInfo.avatar as string,
    );

    userContext.setUser({ ...userInfo, avatar: streamedAvatar as Blob });
  };

  useEffect(() => {
    getUserInfo();
  }, []);
};

export default useUserInfo;
