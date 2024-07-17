import {
  Avatar,
  Box,
  Flex,
  HStack,
  Icon,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { messages } from "../../mock/messages";

export function InboxPage() {
  // const { data, isPending } = useQuery({
  //   queryKey: ["messages"],
  //   queryFn: async () => {
  //     const req = await loggedApi.get("/messages");
  //     const data = req.data;
  //     // console.log(data);
  //     return data;
  //   },
  // });

  const [isLg] = useMediaQuery("(min-width: 1020px)");

  return (
    <Box p={7}>
      <Stack>
        {messages["hydra:member"].map((message) => (
          <Link key={message.id} to={`/message/${message.id}`}>
            <Flex
              alignItems={"center"}
              p={4}
              bg="white"
              _dark={{
                bg: "gray.700",
              }}
              rounded={"md"}
            >
              <Box flex={1}>
                <HStack>
                  <Avatar name={message.from.name || message.from.address} />
                  <Stack spacing={0}>
                    <Text>{message.from.name}</Text>
                    <Text>{message.from.address}</Text>
                  </Stack>
                </HStack>
              </Box>
              {/* useMediaQuery to hide when small screen */}
              {isLg && <Box flex={1}>{message.intro}</Box>}
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
    </Box>
  );
}
