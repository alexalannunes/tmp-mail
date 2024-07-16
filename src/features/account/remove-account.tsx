import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Account, useAccount } from "../../data/context/account-context";
import { loggedApi } from "../../infra/http";
import { LocalStorageKeys } from "../../storage/keys";
import { RemoveAccountDialogProps } from "./types";

async function removeAccountFetch(accountId: string): Promise<void> {
  const request = await loggedApi.delete(`/accounts/${accountId}`);
  return request.data;
}

export function RemoveAccountDialog({
  onClose,
  isOpen,
}: RemoveAccountDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

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
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete account
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You can't undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={onClose}
              isDisabled={isLoadingRemoveAccount}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleOk}
              ml={3}
              isLoading={isLoadingRemoveAccount}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
