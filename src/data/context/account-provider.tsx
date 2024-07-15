import { useState, ReactNode } from "react";
import {
  Account,
  AccountContext,
  AccountContextDispatch,
} from "./account-context";

export function AccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);

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
