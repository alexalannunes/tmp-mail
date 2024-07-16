import {
  CreateAccountRequest,
  GetTokenResponse,
} from "../../features/account/types";
import { api } from "../../infra/http";

export async function getAccountTokenFetch(
  params: CreateAccountRequest
): Promise<GetTokenResponse> {
  const request = await api.post("/token", params);
  return request.data;
}
