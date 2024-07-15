import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SlideFade,
  Text,
  useClipboard,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { FaMoon, FaSun, FaTrash, FaUser } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import {
  useAccount,
  useAccountDispatch,
} from "../../data/context/account-context";
import { CreateAccountDialog } from "../../features/account/create-account";
import { RemoveAccountDialog } from "../../features/account/remove-account";

function HeaderCurrentMail({ email }: { email: string }) {
  const account = useAccount();

  const { onCopy, hasCopied } = useClipboard(email);
  return (
    <Flex alignItems={"center"} gap={2}>
      <Button variant={"ghost"} size={"sm"} onClick={onCopy}>
        {account?.address ?? email}
      </Button>
      <SlideFade offsetX={-20} offsetY={0} in={hasCopied}>
        <Icon as={FaCheck} color={"green.500"} _dark={{ color: "green.400" }} />
      </SlideFade>
    </Flex>
  );
}

export function Header() {
  const { toggleColorMode, colorMode } = useColorMode();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isOpenDialog,
    onOpen: openDialog,
    onClose: closeDialog,
  } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const iconTheme = colorMode === "dark" ? <FaSun /> : <FaMoon />;

  const dispatch = useAccountDispatch();

  return (
    <>
      <Flex
        as="header"
        alignItems={"center"}
        px={4}
        h={12}
        borderBottom={"1px solid"}
        borderBottomColor={"gray.200"}
        _dark={{
          borderColor: "gray.700",
        }}
        justifyContent={"space-between"}
      >
        <HeaderCurrentMail email="alexalannunes@gmail.com" />

        <HStack>
          <IconButton
            aria-label="Toggle theme"
            icon={iconTheme}
            variant={"ghost"}
            rounded={"full"}
            onClick={toggleColorMode}
            color={"gray.500"}
            _dark={{
              color: "white",
            }}
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
                  src="https://github.com/alexalannunes.png"
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

              <MenuItem
                mb={2}
                onClick={() => {
                  dispatch({
                    "@context": "m",
                    "@id": "lee",
                    "@type": "kjd",
                    address: "alexalannunes@io.cm",
                    createdAt: "kkd",
                    id: "3283378378782",
                    isDeleted: false,
                    isDisabled: false,
                    retentionAt: "ldd",
                    updatedAt: "jdjkdjkd",
                  });
                }}
              >
                <Box w={10}>
                  <Avatar size={"xs"} name="Alex Nunes" />
                </Box>
                <Text noOfLines={1}>alexalannunes@gmail.com</Text>
              </MenuItem>

              <MenuItem mb={2}>
                <Box w={10}>
                  <Avatar size={"xs"} name="Bale Sigas" />
                </Box>
                <Text noOfLines={1}>lkfmrklrkltl@gmail.com</Text>
              </MenuItem>

              <MenuItem mb={2}>
                <Box w={10}>
                  <Avatar size={"xs"} name="Mohamdn A" />
                </Box>
                <Text noOfLines={1}>dewfrlkemfrekl@gmail.com</Text>
              </MenuItem>

              {/* add divider when has account */}
              <Divider />
              <MenuItem onClick={onOpen}>
                <Box w={10}>
                  <FaUser />
                </Box>
                Create an account
              </MenuItem>
              <MenuItem
                onClick={openDialog}
                _hover={{
                  color: "red.400",
                }}
              >
                <Box w={10}>
                  <FaTrash />
                </Box>
                Delete account
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      <CreateAccountDialog
        onClose={onClose}
        isOpen={isOpen}
        // onOk={(data) => {
        //   console.log(data);
        // }}
      />

      <RemoveAccountDialog
        isOpen={isOpenDialog}
        onClose={closeDialog}
        cancelRef={cancelRef}
        onOk={() => {
          console.log("remove");
        }}
      />
    </>
  );
}
