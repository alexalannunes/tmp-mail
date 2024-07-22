import { Skeleton, Text } from "@chakra-ui/react";
import { useMessage } from "./use-message";
import { useMessageView } from "./message-context";

export function MessageTitle() {
  const message = useMessageView();
  const { isLoadingMessage } = useMessage();
  return (
    <Skeleton minH="14px" minW={"400px"} isLoaded={!isLoadingMessage}>
      <Text fontWeight={"semibold"}>{message?.subject}</Text>
    </Skeleton>
  );
}
