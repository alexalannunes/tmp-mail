import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import { MdAllInbox } from "react-icons/md";
import { Link } from "react-router-dom";

export function Aside() {
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
      </Stack>
    </Box>
  );
}
