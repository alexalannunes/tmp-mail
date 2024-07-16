import { createContext, useContext } from "react";
export interface Account {
  "@context": string;
  "@id": string;
  "@type": string;
  id: string;
  address: string;
  isDisabled: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  retentionAt: string;
  password: string;
}

type AccountDispatchFn = (newAccount: Account) => void;

export const AccountContextDispatch = createContext<AccountDispatchFn>(
  () => {}
);

export const AccountContext = createContext<Account | null>(null);

export function useAccount() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error("useAccount must be inside of AccountContext");
  }
  return context;
}

export function useAccountDispatch() {
  const context = useContext(AccountContextDispatch);
  if (context === undefined) {
    throw new Error(
      "useAccountDispatch must be inside of AccountContextDispatch"
    );
  }
  return context;
}
