import { Box } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export function MessagePage() {
  const { messageId } = useParams();

  return <Box p={7}>{messageId}</Box>;
}
