import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { MdDeleteOutline, MdOutlineMessage } from "react-icons/md";
import { loggedApi } from "../../infra/http";
import { MessageView } from "../../mock/messages";
import { useLocalStorage } from "usehooks-ts";
import { LocalStorageKeys } from "../../storage/keys";

export function MessagePage() {
  const { messageId } = useParams();

  const {
    data: message,
    isPending,
    isFetching,
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

  const navigate = useNavigate();
  const [, setReadMessages] = useLocalStorage<string[]>(
    LocalStorageKeys.READ,
    []
  );

  const handleMarkAsUnread = () => {
    setReadMessages((prev) => prev.filter((msgId) => msgId !== messageId));
    navigate("/");
  };

  const isLoading = isPending || isFetching;

  return (
    <Box p={7}>
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <Skeleton height="14px" w={"400px"} isLoaded={!isLoading}>
          <Text fontWeight={"semibold"}>{message?.subject}</Text>
        </Skeleton>
        <HStack>
          <Button
            size="sm"
            variant={"outline"}
            colorScheme="cyan"
            leftIcon={<MdOutlineMessage />}
            onClick={handleMarkAsUnread}
          >
            Mark as unread
          </Button>
          <Button
            size="sm"
            variant={"outline"}
            colorScheme="red"
            leftIcon={<MdDeleteOutline />}
          >
            Delete
          </Button>
        </HStack>
      </Flex>

      <Box mt={4} padding="6" bg="white" rounded={"md"}>
        <HStack w={"full"} spacing={6}>
          <SkeletonCircle size={"12"} flexShrink={0} isLoaded={!isLoading}>
            <Avatar name={message?.from.name || message?.from.address} />
          </SkeletonCircle>
          <Stack w={"full"}>
            <Skeleton height="16px" isLoaded={!isLoading}>
              <Text color={"cyan.500"}>{message?.from.name}</Text>
            </Skeleton>
            <Skeleton height="16px" isLoaded={!isLoading}>
              <Text fontSize={"14px"} color={"gray.500"}>
                {message?.from.address}
              </Text>
            </Skeleton>
          </Stack>
        </HStack>
        <SkeletonText
          noOfLines={4}
          mt={10}
          spacing="4"
          skeletonHeight="4"
          isLoaded={!isLoading}
        >
          <Box>
            {message?.html.map((html, index) => (
              <Box
                color="gray.800"
                key={index}
                dangerouslySetInnerHTML={{
                  __html: html,
                }}
              />
            ))}
          </Box>
        </SkeletonText>
      </Box>
    </Box>
  );
}
