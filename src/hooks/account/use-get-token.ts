import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  CreateAccountRequest,
  ErrorResponse,
  GetTokenResponse,
} from "../../features/account/types";
import { getAccountTokenFetch } from "../../services/account/get-token";
import { CreateToastFnReturn } from "@chakra-ui/react";

export function useGetToken({
  onSuccess,
  toast,
}: {
  onSuccess: (
    data: GetTokenResponse,
    variables: CreateAccountRequest
  ) => unknown;
  toast: CreateToastFnReturn;
}): {
  isLoadingGetToken: boolean;
  getToken: UseMutateFunction<
    GetTokenResponse,
    AxiosError<ErrorResponse>,
    CreateAccountRequest
  >;
} {
  const { isPending: isLoadingGetToken, mutate: getToken } = useMutation<
    GetTokenResponse,
    AxiosError<ErrorResponse>,
    CreateAccountRequest
  >({
    mutationKey: ["account-token"],
    mutationFn: getAccountTokenFetch,
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

  return { isLoadingGetToken, getToken };
}
