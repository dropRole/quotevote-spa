import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios, { AxiosError } from "axios";
import { isUserLoggedIn } from "../utils/functions";

type APIResponse<T> = {
  status: number;
  message?: string;
  data?: T;
};

export default abstract class HTTPClient {
  private AXIOS: AxiosInstance;

  constructor(url: string) {
    this.AXIOS = axios.create({ baseURL: url });
    this.AXIOS.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const {
          request: { withCredentials },
          response: { status },
        } = error;

        if (withCredentials && status === 401 && isUserLoggedIn()) {
          localStorage.removeItem("quotevote-session");

          window.location.replace("/login");
        }
      },
    );
  }

  async post<Create, Return = void>(
    endpoint: string,
    data: Create,
    config?: AxiosRequestConfig,
  ): Promise<APIResponse<Return>> {
    let response: AxiosResponse | undefined;

    try {
      response = await this.AXIOS.post(endpoint, data, config);
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
      response = await this.AXIOS.get(endpoint, config);
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

  async patch<Update>(
    endpoint: string,
    data: Update,
    config?: AxiosRequestConfig,
  ) {
    let response: AxiosResponse | undefined;

    try {
      response = await this.AXIOS.patch(endpoint, data, config);
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

  async delete(endpoint: string, config?: AxiosRequestConfig) {
    let response: AxiosResponse | undefined;

    try {
      response = await this.AXIOS.delete(endpoint, config);
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
