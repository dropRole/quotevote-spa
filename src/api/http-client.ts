import type { AxiosRequestConfig, AxiosResponse } from "axios";
import axios, { AxiosError } from "axios";

type APIResponse<T> = {
  status: number;
  message?: string;
  data?: T;
};

export default abstract class HTTPClient {
  private URL: string;

  constructor(url: string) {
    this.URL = url;
  }

  async post<Create, Return = void>(
    endpoint: string,
    data: Create,
    config?: AxiosRequestConfig,
  ): Promise<APIResponse<Return>> {
    let response: AxiosResponse | undefined;

    try {
      response = await axios.post(this.URL + endpoint, data, config);
    } catch (error) {
      if (error instanceof AxiosError)
        return {
          status: error.status ?? 500,
          message: error?.response?.data?.message,
        };
    }

    if (response)
      return {
        status: response.status,
        data: response?.data,
      };

    return { status: 500, message: "Internal server error" };
  }

  async get<Return>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<APIResponse<Return>> {
    let response: AxiosResponse | undefined;

    try {
      response = await axios.get(this.URL + endpoint, config);
    } catch (error) {
      if (error instanceof AxiosError)
        return {
          status: error.status ?? 500,
          message: error?.response?.data?.message,
        };
    }

    if (response)
      return {
        status: response.status,
        data: response?.data,
      };

    return { status: 500, message: "Internal server error" };
  }
}
