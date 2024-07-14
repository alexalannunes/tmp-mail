import axios from "axios";

const baseURL = "https://api.mail.tm";

export const api = axios.create({
  baseURL,
});
