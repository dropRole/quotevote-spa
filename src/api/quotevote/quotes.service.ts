import HTTPClient from "../http-client";
import type { User } from "./users.service";

export type Quote = {
  id: string;
  content: string;
  written: string;
  updated: string;
  totalVotes: number;
} & User;

export default class QuotesService extends HTTPClient {
  private PATH = "/quotes";

  constructor() {
    const url = import.meta.env.VITE_QUOTEVOTE_API_URL;

    super(url);
  }

  async getQuotes(
    searchFor: "mostLiked" | "leastLiked" | "recent",
    author: string,
    limit: number,
  ) {
    const query = `?searchFor=${searchFor}&author=${author}&limit=${limit}`;

    const { status, data } = await this.get<Quote[]>(this.PATH + query);

    if (status === 200) return data;
  }

  async createQuote(content: string) {
    const { status, message } = await this.post<Pick<Quote, "content">>(
      this.PATH + "/me/myquote",
      { content },
      { withCredentials: true },
    );

    if (status === 201) return { success: 1, message: "Quote was posted" };

    return { success: 0, message };
  }
}
