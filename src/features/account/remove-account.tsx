import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";
import { Account, useAccount } from "../../data/context/account-context";
import { loggedApi } from "../../infra/http";
import { LocalStorageKeys } from "../../storage/keys";
import { DeleteModal } from "../../ui/components/modal-delete/modal-delete";
import { RemoveAccountDialogProps } from "./types";

async function removeAccountFetch(accountId: string): Promise<void> {
  const request = await loggedApi.delete(`/accounts/${accountId}`);
  return request.data;
}

export function RemoveAccountDialog({
  onClose,
  isOpen,
}: RemoveAccountDialogProps) {
  const [, setAccounts] = useLocalStorage<Account[]>(
    LocalStorageKeys.ACCOUNTS,
    []
  );
  const [, , removeLocalAccount] = useLocalStorage<Account[]>(
    LocalStorageKeys.ACCOUNT,
    []
  );

  const account = useAccount();

  const toast = useToast();

  const { isPending: isLoadingRemoveAccount, mutate: removeAccount } =
    useMutation<void, Error, string>({
      mutationKey: ["remove-account"],
      mutationFn: removeAccountFetch,
      onSuccess: () => {
        onClose();
        toast({
          title: "Account removed",
        });

        setAccounts((prev) => {
          return prev.filter((accountItem) => accountItem.id !== account?.id);
        });

        removeLocalAccount();
      },
      onError: () => {
        toast({
          title: "Something went wrong to remove account",
          isClosable: true,
        });
      },
    });

  const handleOk = () => {
    if (account) {
      removeAccount(account.id);
    }
  };
  return (
    <DeleteModal
      title="Delete account"
      isOpen={isOpen}
      onClose={onClose}
      onOk={handleOk}
      isLoading={isLoadingRemoveAccount}
    />
  );
}
