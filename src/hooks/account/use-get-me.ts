import { CreateToastFnReturn } from "@chakra-ui/react";
import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Account } from "../../data/context/account-context";
import { ErrorResponse } from "../../features/account/types";
import { getAccountInfoFetch } from "../../services/account/get-me";

export function useGetMe({
  onSuccess,
  toast,
}: {
  onSuccess: (data: Account, variables: void, context: unknown) => unknown;
  toast: CreateToastFnReturn;
}): {
  isLoadingAccountInfo: boolean;
  getAccountInfo: UseMutateFunction<
    Account,
    AxiosError<ErrorResponse, any>,
    void,
    unknown
  >;
} {
  const { isPending: isLoadingAccountInfo, mutate: getAccountInfo } =
    useMutation<Account, AxiosError<ErrorResponse>>({
      mutationKey: ["account-info"],
      mutationFn: getAccountInfoFetch,
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

  return { isLoadingAccountInfo, getAccountInfo };
}
