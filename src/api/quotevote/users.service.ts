import HTTPClient from "../http-client";

export type SignupData = {
  email: string;
  name: string;
  surname: string;
  username: string;
  pass: string;
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
}
