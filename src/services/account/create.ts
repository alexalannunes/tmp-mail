import { Account } from "../../data/context/account-context";
import { CreateAccountRequest } from "../../features/account/types";
import { api } from "../../infra/http";

// TODO: map http errors code
export async function createAccountFetch(
  params: CreateAccountRequest
): Promise<Account> {
  const request = await api.post("/accounts", params);
  return request.data;
}
