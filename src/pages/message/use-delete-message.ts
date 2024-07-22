import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { loggedApi } from "../../infra/http";
import { useToast } from "@chakra-ui/react";

async function deleteMessageFetch(messageId: string): Promise<void> {
  const request = await loggedApi.delete(`/messages/${messageId}`);
  return request.data;
}

export function useDeleteMessage({
  onSuccess,
}: {
  onSuccess: (data: void, variables: string, context: unknown) => unknown;
}): {
  isDeleteMessageLoading: boolean;
  deleteMessage: UseMutateFunction<void, Error, string, unknown>;
} {
  // coupling
  const toast = useToast();
  const { isPending: isDeleteMessageLoading, mutate: deleteMessage } =
    useMutation<void, Error, string>({
      mutationKey: ["remove-account"],
      mutationFn: deleteMessageFetch,
      onSuccess,
      onError: () => {
        toast({
          title: "Something went wrong to remove message",
          isClosable: true,
        });
      },
    });

  return { isDeleteMessageLoading, deleteMessage };
}
