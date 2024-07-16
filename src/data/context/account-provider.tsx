import { ReactNode } from "react";
import { useLocalStorage } from "usehooks-ts";
import { LocalStorageKeys } from "../../storage/keys";
import {
  Account,
  AccountContext,
  AccountContextDispatch,
} from "./account-context";

export function AccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useLocalStorage<Account | null>(
    LocalStorageKeys.ACCOUNT,
    null
  );

  const updateAccount = (newAccount: Account) => {
    setAccount(newAccount);
  };

  return (
    <AccountContext.Provider value={account}>
      <AccountContextDispatch.Provider value={updateAccount}>
        {children}
      </AccountContextDispatch.Provider>
    </AccountContext.Provider>
  );
}
