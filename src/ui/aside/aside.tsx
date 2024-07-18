import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import { MdAllInbox, MdRefresh } from "react-icons/md";
import { Link } from "react-router-dom";
import { useMessages } from "../../pages/inbox/inbox";

export function Aside() {
  const { isRefetching, refetch } = useMessages();

  return (
    <Box
      w="260px"
      px={4}
      as="aside"
      borderRight={"1px solid"}
      borderRightColor={"gray.200"}
      _dark={{
        borderColor: "gray.700",
      }}
    >
      <Link to={"/"}>
        <Flex fontSize={20} h={12} alignItems={"center"}>
          <Text
            bgGradient="linear(to-l, #7928CA, #FF0080)"
            bgClip="text"
            fontWeight="extrabold"
          >
            tmp.
          </Text>
          <Text fontWeight={"bold"}>mail</Text>
        </Flex>
      </Link>

      <Stack mt={4}>
        <Button
          variant={"ghost"}
          justifyContent={"flex-start"}
          isActive
          leftIcon={<MdAllInbox />}
          as={Link}
          to={"/"}
        >
          Inbox
        </Button>

        <Button
          variant={"ghost"}
          justifyContent={"flex-start"}
          leftIcon={<MdRefresh />}
          isLoading={isRefetching}
          onClick={() => refetch()}
        >
          Refresh
        </Button>
      </Stack>
    </Box>
  );
}
