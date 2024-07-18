import { Box, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { loggedApi } from "../../infra/http";
import { MessageView } from "../../mock/messages";

export function MessagePage() {
  const { messageId } = useParams();

  const { data, isPending } = useQuery<MessageView>({
    queryKey: ["message", messageId],
    queryFn: async () => {
      const req = await loggedApi.get(`/messages/${messageId}`);
      const data = req.data;
      return data;
    },
    retry: false,
    enabled: !!messageId,
  });

  return (
    <Box p={7}>
      {isPending && <Spinner />}

      <Box bg="white" p={3}>
        {data?.html.map((html, index) => (
          <div
            style={{ color: "white" }}
            key={index}
            dangerouslySetInnerHTML={{
              __html: html,
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
