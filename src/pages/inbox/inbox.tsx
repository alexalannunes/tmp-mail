import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  HStack,
  Icon,
  Spinner,
  Stack,
  StackDivider,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
} from "@tanstack/react-query";
import { Locale, formatDistance } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import { FaChevronRight } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import { Link } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import { useAccount } from "../../data/context/account-context";
import { usePageTitle } from "../../hooks/app/use-page-title";
import { LanguageType } from "../../i18n";
import { loggedApi } from "../../infra/http";
import { Message } from "../../mock/messages";
import { LocalStorageKeys } from "../../storage/keys";

interface UseMessages {
  messages: Message | undefined;
  isPending: boolean;
  isRefetching: boolean;
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<Message, Error>>;
}

export function useMessages(): UseMessages {
  const account = useAccount();
  const {
    isPending,
    isRefetching,
    refetch,
    data: messages,
  } = useQuery<Message>({
    queryKey: ["messages"],
    queryFn: async () => {
      const req = await loggedApi.get("/messages");
      const data = req.data;
      return data;
    },
    enabled: !!account?.id,
  });

  return { messages, isPending, isRefetching, refetch };
}

export function InboxPage() {
  const { messages, isPending } = useMessages();

  const [readMessages, setReadMessages] = useLocalStorage<string[]>(
    LocalStorageKeys.READ,
    []
  );

  usePageTitle();

  const [isLg] = useMediaQuery("(min-width: 1020px)");

  const [language] = useLocalStorage<LanguageType>(LocalStorageKeys.LANGUAGE, {
    lng: "en",
  });

  // const { mutate: seenMessage } = useMutation({
  //   mutationKey: ["message-seen"],
  //   mutationFn: async (messageId: string) => {
  //     // problem with patch route: invalid content-type
  //     // sent an email to support
  //     // const req = await loggedApi.patch(`/messages/${messageId}`);
  //     // return req.data;
  //   },
  //   gcTime: 0,
  // });

  const handleSeenMessage = (messageId: string) => {
    // possible event tracking here

    setReadMessages((prev) => {
      if (prev.includes(messageId)) return prev;

      return [...prev, messageId];
    });
    // mutation
    // seenMessage(messageId);
  };

  function renderLoadingContent() {
    // create skeleton
    return (
      <Flex
        w="full"
        height={"400px"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Spinner />
      </Flex>
    );
  }

  function renderNoMessagesContent() {
    return (
      <Flex alignItems={"center"} justifyContent={"center"} height={"300px"}>
        <Text>No messages yet :)</Text>
      </Flex>
    );
  }

  function renderMessagesContent() {
    const localeMap: Record<string, Locale> = {
      en: enUS,
      pt: ptBR,
    };
    const locale = localeMap[language.lng];

    return (
      <Stack
        divider={<StackDivider />}
        spacing={0}
        sx={{
          "& > a:first-of-type .message-container": {
            borderTopLeftRadius: "md",
            borderTopRightRadius: "md",
          },
          "& > a:last-of-type .message-container": {
            borderBottomLeftRadius: "md",
            borderBottomRightRadius: "md",
          },
        }}
      >
        {messages?.["hydra:member"].map((message) => (
          <Link
            key={message.id}
            to={`/message/${message.id}`}
            onClick={() => handleSeenMessage(message.id)}
          >
            <Flex
              alignItems={"center"}
              p={4}
              bg="white"
              _dark={{ bg: "gray.700" }}
              _hover={{
                bg: "gray.50",
                _dark: {
                  bg: "gray.600",
                },
              }}
              className="message-container"
            >
              <Box w={isLg ? "600px" : "auto"}>
                <HStack>
                  <Avatar name={message.from.name || message.from.address}>
                    {
                      // !message.seen
                      !readMessages.includes(message.id) && (
                        <AvatarBadge boxSize={"1.2rem"} bg={"blue.300"} />
                      )
                    }
                  </Avatar>
                  <Stack spacing={0}>
                    <Text color={"cyan.500"} fontWeight={"semibold"}>
                      {message.from.name}
                    </Text>
                    <HStack alignItems={"center"}>
                      <Icon color={"gray.500"} as={MdMail} />
                      <Text color={"gray.500"}>{message.from.address}</Text>
                    </HStack>
                  </Stack>
                </HStack>
              </Box>
              {/* useMediaQuery to hide when small screen */}
              {isLg && (
                <Stack flex={1} spacing={0}>
                  <Text
                    color={"gray.800"}
                    _dark={{
                      color: "gray.400",
                    }}
                    noOfLines={1}
                  >
                    {message.subject}
                  </Text>
                  <Text
                    color={"gray.800"}
                    _dark={{
                      color: "gray.400",
                    }}
                    fontSize={"small"}
                  >
                    {formatDistance(message.createdAt, new Date(), {
                      addSuffix: true,
                      locale,
                    })}
                  </Text>
                </Stack>
              )}
              {/* useMediaQuery to hide when small screen */}
              {isLg && (
                <Flex
                  alignItems={"center"}
                  justifyContent={"flex-end"}
                  w={"40"}
                >
                  <Icon as={FaChevronRight} />
                </Flex>
              )}
            </Flex>
          </Link>
        ))}
      </Stack>
    );
  }

  function renderContent() {
    if (isPending) {
      return renderLoadingContent();
    }

    if (!isPending && !messages?.["hydra:member"].length) {
      return renderNoMessagesContent();
    }

    return renderMessagesContent();
  }

  return <Box p={7}>{renderContent()}</Box>;
}
