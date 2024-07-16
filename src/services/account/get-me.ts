import { Account } from "../../data/context/account-context";
import { loggedApi } from "../../infra/http";

export async function getAccountInfoFetch(): Promise<Account> {
  const request = await loggedApi.get("/me");
  return request.data;
}
