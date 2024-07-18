import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { MdFavorite } from "react-icons/md";
import { Aside } from "./ui/aside/aside";
import { Header } from "./ui/header/header";
function App() {
  return (
    <Flex minH={"100vh"}>
      <Aside />
      <Flex flexDirection={"column"} flex={1}>
        <Header />
        <Box
          flex={1}
          bg="gray.100"
          _dark={{
            bg: "gray.800",
          }}
        >
          <Outlet />
        </Box>
        <Box px={7} py={2}>
          <Flex
            gap={2}
            alignItems={"center"}
            fontSize={"14px"}
            justifyContent={"center"}
          >
            <Text
              color={"gray.700"}
              _dark={{
                color: "gray.400",
              }}
            >
              Made with
            </Text>
            <MdFavorite color="red" /> {/* setup vercel url */}
            <Link
              href="https://docs.mail.tm/?ref=tmp.mail.vercel.app"
              target="_blank"
              color={"teal.500"}
              _dark={{
                color: "teal.400",
              }}
            >
              https://docs.mail.tm
            </Link>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}

export default App;
