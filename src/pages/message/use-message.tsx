import { useParams } from "react-router-dom";
import { loggedApi } from "../../infra/http";
import { MessageView } from "./types";
import { useQuery } from "@tanstack/react-query";

export function useMessage(): {
  message: MessageView;
  isLoadingMessage: boolean;
  isFetchingMessage: boolean;
} {
  const { messageId } = useParams();

  const {
    data: message = {} as MessageView,
    isPending: isLoadingMessage,
    isFetching: isFetchingMessage,
  } = useQuery<MessageView>({
    queryKey: ["message", messageId],
    queryFn: async () => {
      const req = await loggedApi.get(`/messages/${messageId}`);
      const data = req.data;
      return data;
    },
    retry: false,
    enabled: !!messageId,
  });

  return { message, isLoadingMessage, isFetchingMessage };
}
