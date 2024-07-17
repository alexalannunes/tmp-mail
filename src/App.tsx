import { Box, Flex } from "@chakra-ui/react";
import { Aside } from "./ui/aside/aside";
import { Header } from "./ui/header/header";
import { Outlet } from "react-router-dom";
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
      </Flex>
    </Flex>
  );
}

export default App;
