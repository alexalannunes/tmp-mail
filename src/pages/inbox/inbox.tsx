import { Box } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { loggedApi } from "../../infra/http";

export function InboxPage() {
  const { data, isPending } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const req = await loggedApi.get("/messages");
      const data = req.data;
      console.log(data);
      return data;
    },
  });

  return (
    <Box p={7}>
      {isPending && <>loading...</>}
      {data?.["hydra:member"]?.length} message
      <br />
      {data?.["hydra:member"]?.[0]?.intro}
    </Box>
  );
}
