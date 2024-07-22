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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { MdDeleteOutline, MdOutlineMessage } from "react-icons/md";
import { useLocalStorage } from "usehooks-ts";
import { loggedApi } from "../../infra/http";
import { LocalStorageKeys } from "../../storage/keys";
import { DeleteModal } from "../../ui/components/modal-delete/modal-delete";
import { useMessages } from "../inbox/inbox";
import { usePageTitle } from "../../hooks/app/use-page-title";
import { MessageView } from "./types";

async function deleteMessageFetch(messageId: string): Promise<void> {
  const request = await loggedApi.delete(`/messages/${messageId}`);
  return request.data;
}

export function MessagePage() {
  const { messageId } = useParams();

  const {
    isOpen: isDeleteMessageOpen,
    onClose: onDeleteMessageClose,
    onOpen: onDeleteMessageOpen,
  } = useDisclosure();

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

  const { refetch } = useMessages();

  const [, setReadMessages] = useLocalStorage<string[]>(
    LocalStorageKeys.READ,
    []
  );

  const toast = useToast();

  const { isPending: isDeleteMessageLoading, mutate: deleteMessage } =
    useMutation<void, Error, string>({
      mutationKey: ["remove-account"],
      mutationFn: deleteMessageFetch,
      onSuccess: () => {
        onDeleteMessageClose();

        refetch();
        navigate("/");
      },
      onError: () => {
        toast({
          title: "Something went wrong to remove message",
          isClosable: true,
        });
      },
    });

  usePageTitle(message?.subject);

  const handleMarkAsUnread = () => {
    setReadMessages((prev) => prev.filter((msgId) => msgId !== messageId));
    navigate("/");
  };

  const handleOk = () => {
    if (messageId) {
      deleteMessage(messageId);
    }
  };

  const isLoading = isPending || isFetching;

  return (
    <>
      <Box p={7}>
        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <Skeleton minH="14px" minW={"400px"} isLoaded={!isLoading}>
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
              onClick={onDeleteMessageOpen}
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
      <DeleteModal
        title="Delete message"
        onClose={onDeleteMessageClose}
        isOpen={isDeleteMessageOpen}
        isLoading={isDeleteMessageLoading}
        onOk={handleOk}
      />
    </>
  );
}
