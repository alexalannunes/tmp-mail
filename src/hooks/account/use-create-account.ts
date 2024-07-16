import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { createAccountFetch } from "../../services/account/create";
import { Account } from "../../data/context/account-context";
import { AxiosError } from "axios";
import {
  CreateAccountRequest,
  ErrorResponse,
} from "../../features/account/types";
import { CreateToastFnReturn } from "@chakra-ui/react";

export function useCreateAccount({
  onSuccess,
  toast,
}: {
  onSuccess: (data: Account, variables: CreateAccountRequest) => unknown;
  toast: CreateToastFnReturn;
}): {
  isLoadingCreateAccount: boolean;
  createAccount: UseMutateFunction<
    Account,
    AxiosError<ErrorResponse>,
    CreateAccountRequest,
    unknown
  >;
} {
  const { isPending: isLoadingCreateAccount, mutate: createAccount } =
    useMutation<Account, AxiosError<ErrorResponse>, CreateAccountRequest>({
      mutationKey: ["create-account"],
      mutationFn: createAccountFetch,
      onSuccess,
      onError: (error) => {
        toast({
          title:
            error.response?.data.message ||
            error.response?.data.detail ||
            "Something went wrong",
          isClosable: true,
        });
      },
    });

  return { isLoadingCreateAccount, createAccount };
}
