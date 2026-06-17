import HTTPClient from "../http-client";

export type SignupData = {
  email: string;
  name: string;
  surname: string;
  username: string;
  pass: string;
};

export type User = {
  email: string;
  name: string;
  surname: string;
  username: string;
  avatar: string | null;
};

export default class UsersService extends HTTPClient {
  private PATH = "/auth";

  constructor() {
    const url = import.meta.env.VITE_QUOTEVOTE_API_URL;

    super(url);
  }

  async signup(data: SignupData) {
    const { status, message } = await this.post(this.PATH + "/signup", data);

    if (status === 201)
      return { success: 1, message: "Sign up was successful" };

    return { success: 0, message };
  }

  async login(credentials: Pick<SignupData, "username" | "pass">) {
    const { status, message } = await this.post(
      this.PATH + "/login",
      credentials,
      { withCredentials: true },
    );

    if (status === 201) return { success: 1, message: "Login was succesful" };

    return { success: 0, message };
  }

  async getInfo() {
    const { status, message, data } = await this.get<User>(this.PATH + "/me", {
      withCredentials: true,
    });

    if (status === 200) return { success: 1, data };

    return { success: 0, message };
  }

  async getAvatar(path: string) {
    const { status, message, data } = await this.get<Blob>(
      this.PATH + `/me/avatar?path=${path}`,
      { responseType: "blob" },
    );

    if (status === 200) return { success: 1, data };

    return { success: 0, message };
  }

  async updateBasics(data: Omit<User, "username">) {
    const { status, message } = await this.patch(
      this.PATH + "/me/basics",
      data,
      {
        withCredentials: true,
      },
    );

    if (status === 200) return { success: 1, message: "Basics were updated" };

    return { success: 0, message };
  }

  async updatePass(data: { currentPass: string; newPass: string }) {
    const { status, message } = await this.patch(this.PATH + "/me/pass", data, {
      withCredentials: true,
    });

    if (status === 200) return { success: 1, message: "Password was updated" };

    return { success: 0, message };
  }

  async uploadAvatar(data: FileList) {
    const formData = new FormData();
    formData.append("avatar", data.avatar[0]);

    const { status, message } = await this.patch(
      this.PATH + "/me/avatar-upload",
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (status === 200) return { success: 1, message: "Avatar was uploaded" };

    return { success: 0, message };
  }
}
