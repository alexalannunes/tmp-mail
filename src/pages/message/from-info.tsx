import {
  Avatar,
  HStack,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useMessage } from "./use-message";
import { useMessageView } from "./message-context";

export function MessageFromInfo() {
  const message = useMessageView();
  const { isLoadingMessage } = useMessage();

  return (
    <HStack w={"full"} spacing={6}>
      <SkeletonCircle size={"12"} flexShrink={0} isLoaded={!isLoadingMessage}>
        <Avatar name={message?.from?.name || message?.from?.address} />
      </SkeletonCircle>
      <Stack w={"full"}>
        <Skeleton height="16px" isLoaded={!isLoadingMessage}>
          <Text color={"cyan.500"}>{message?.from?.name}</Text>
        </Skeleton>
        <Skeleton height="16px" isLoaded={!isLoadingMessage}>
          <Text fontSize={"14px"} color={"gray.500"}>
            {message?.from?.address}
          </Text>
        </Skeleton>
      </Stack>
    </HStack>
  );
}
