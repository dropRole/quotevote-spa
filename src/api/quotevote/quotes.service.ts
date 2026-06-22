import { isUserLoggedIn } from "../../utils/functions";
import HTTPClient from "../http-client";
import type { User } from "./users.service";

export type Quote = {
  id: string;
  content: string;
  written: string;
  updated: string;
  totalVotes: string;
  votedOn: "up" | "down" | undefined;
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

    const { status, data } = await this.get<Quote[]>(this.PATH + query, {
      withCredentials: isUserLoggedIn() ? true : false,
    });

    if (status === 200) return data;
  }

  async getQuote(id: string) {
    const { status, data, message } = await this.get<Quote>(
      this.PATH + `/${id}`,
      { withCredentials: true },
    );

    if (status === 200) return { success: 1, data };

    return { success: 0, message };
  }

  async getRandomQuote() {
    const { status, data, message } = await this.get<Quote>(
      this.PATH + "/rand/one",
      { withCredentials: true },
    );

    if (status === 200) return { success: 1, data };

    return { success: 0, message };
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

  async voteOnQuote(quoteId: string, vote: "up" | "down") {
    const { status, message } = await this.patch<{ vote: "up" | "down" }>(
      this.PATH + `/${quoteId}/vote`,
      { vote },
      {
        withCredentials: true,
      },
    );

    if (status === 200) return { success: 1 };

    return { success: 0, message };
  }
}
