import axios from "axios";
import { LocalStorageKeys } from "../storage/keys";
import { AccountTokenType } from "../features/account/types";

const baseURL = "https://api.mail.tm";

export const api = axios.create({
  baseURL,
});

export const loggedApi = axios.create({
  baseURL,
});

loggedApi.interceptors.request.use((config) => {
  // can be better?
  const tokenRaw = localStorage.getItem(LocalStorageKeys.TOKEN);
  if (tokenRaw) {
    const token = JSON.parse(tokenRaw) as AccountTokenType;
    config["headers"]["Authorization"] = `Bearer ${token.jwt}`;
  }

  return config;
});
