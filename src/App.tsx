import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaUser, FaSun, FaTrash } from "react-icons/fa";
import { MdAllInbox } from "react-icons/md";
function App() {
  return (
    <Flex minH={"100vh"}>
      <Box
        w="260px"
        px={4}
        as="aside"
        borderRight={"1px solid"}
        borderRightColor={"gray.700"}
      >
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

        <Stack mt={4}>
          <Button
            variant={"ghost"}
            justifyContent={"flex-start"}
            isActive
            leftIcon={<MdAllInbox />}
          >
            Inbox
          </Button>
        </Stack>
      </Box>
      <Flex flexDirection={"column"}>
        <Flex
          as="header"
          alignItems={"center"}
          px={4}
          h={12}
          borderBottom={"1px solid"}
          borderBottomColor={"gray.700"}
          justifyContent={"space-between"}
        >
          <Button variant={"ghost"} size={"sm"}>
            alexalannunes@gmail.com
          </Button>

          <HStack>
            <IconButton
              aria-label="Toggle theme"
              icon={<FaSun />}
              variant={"ghost"}
              rounded={"full"}
            />

            <Menu>
              <MenuButton
                as={IconButton}
                variant={"ghost"}
                rounded={"full"}
                aria-label="Menu accounts"
                icon={
                  <Avatar
                    size={"sm"}
                    name="Dan Abrahmov"
                    src="https://bit.ly/dan-abramov"
                  />
                }
              >
                Actions
              </MenuButton>
              <MenuList maxW={260}>
                <Box p={3} tabIndex={-1}>
                  <Text color={"gray.400"}>You are signed in as</Text>
                  <Text noOfLines={1} cursor={"pointer"}>
                    {/* should select onClick */}
                    pusquenaocrikmslkwmlkswa@maxamba.com
                  </Text>
                  <HStack>
                    <Text color={"gray.400"}>Password:</Text>
                    <Text>alexbabyocara</Text>
                  </HStack>
                </Box>
                <Divider />

                <MenuItem>
                  <Box w={10}>
                    <Avatar size={"xs"} name="Download" />
                  </Box>
                  Accounts here
                </MenuItem>
                {/* add divider when has account */}
                <Divider />
                <MenuItem>
                  <Box w={10}>
                    <FaUser />
                  </Box>
                  Create account
                </MenuItem>
                <MenuItem>
                  <Box w={10}>
                    <FaTrash />
                  </Box>
                  Delete account
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
        <Box flex={1} p={4}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sunt, dicta
          vitae id placeat incidunt harum doloribus aliquid ex recusandae
          repellendus dolor facere impedit alias! Nobis iure quos laudantium
          repudiandae voluptas!
        </Box>
      </Flex>
    </Flex>
  );
}

export default App;
