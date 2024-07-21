import { useToast } from "@chakra-ui/react";
import { ReactNode, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import {
  AccountTokenType,
  CreateAccountRequest,
} from "../../features/account/types";
import { useGetDomains } from "../../hooks/account/use-get-domains";
import { useCreateAccount } from "../../hooks/account/use-create-account";
import { useGetMe } from "../../hooks/account/use-get-me";
import { useGetToken } from "../../hooks/account/use-get-token";
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

  const { data: domain, isPending: isLoadingDomain } = useGetDomains();

  const [, setAccountToken] = useLocalStorage<AccountTokenType>(
    LocalStorageKeys.TOKEN,
    { jwt: "" }
  );

  const updateAccount = (newAccount: Account) => {
    setAccount(newAccount);
  };

  const toast = useToast();

  const { getAccountInfo } = useGetMe({
    // warning: coupling
    toast,
    onSuccess: (data) => {
      const accountData = {
        ...data,
        password: Date.now().toString(16),
      };

      // set current account after crated
      setAccount(accountData);
    },
  });

  // re-use this function to login
  const { getToken } = useGetToken({
    toast,
    onSuccess: (data) => {
      setAccountToken({
        jwt: data.token,
      });
      getAccountInfo();
    },
  });

  const { createAccount } = useCreateAccount({
    toast,
    onSuccess: (_, variables) => getToken(variables),
  });

  useEffect(() => {
    if (!account && domain?.["hydra:totalItems"] && !isLoadingDomain) {
      // get random time id
      const generatedName = Date.now().toString(16);
      // remove numbers
      const onlyLetters = generatedName.replace(/\d/g, "");

      const username = `${onlyLetters}${generatedName}`;

      const accountData: CreateAccountRequest = {
        address: `${username}@${domain?.["hydra:member"]?.[0]?.domain}`,
        password: Date.now().toString(16),
      };

      // first access, we need to create a random account
      // when delete the current account, create a new one
      createAccount(accountData);
    }
  }, [account, domain, isLoadingDomain]);

  return (
    <AccountContext.Provider value={account}>
      <AccountContextDispatch.Provider value={updateAccount}>
        {children}
      </AccountContextDispatch.Provider>
    </AccountContext.Provider>
  );
}
