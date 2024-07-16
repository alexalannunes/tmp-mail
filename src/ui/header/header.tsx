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
  Spinner,
  Text,
  useClipboard,
  useColorMode,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FaMoon, FaSun, FaTrash, FaUser } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";
import {
  Account,
  useAccount,
  useAccountDispatch,
} from "../../data/context/account-context";
import { CreateAccountDialog } from "../../features/account/create-account";
import { RemoveAccountDialog } from "../../features/account/remove-account";
import { LocalStorageKeys } from "../../storage/keys";
import { useGetMe } from "../../hooks/account/use-get-me";
import { useState } from "react";
import { useGetToken } from "../../hooks/account/use-get-token";
import { AccountTokenType } from "../../features/account/types";

// we set a created email if no email was created
const email = "loading@email.com";

function HeaderCurrentMail() {
  const account = useAccount();

  const { onCopy, hasCopied } = useClipboard(account?.address || "");
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

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const account = useAccount();

  const {
    isOpen: isOpenDialog,
    onOpen: openDialog,
    onClose: closeDialog,
  } = useDisclosure();

  const accounts = useReadLocalStorage<Account[]>(LocalStorageKeys.ACCOUNTS);

  const [, setAccount] = useLocalStorage<Account | undefined>(
    LocalStorageKeys.ACCOUNT,
    undefined
  );

  const [, setAccountToken] = useLocalStorage<AccountTokenType>(
    LocalStorageKeys.TOKEN,
    { jwt: "" }
  );

  const iconTheme = colorMode === "dark" ? <FaSun /> : <FaMoon />;

  const dispatch = useAccountDispatch();

  const toast = useToast();

  const { isLoadingAccountInfo, getAccountInfo } = useGetMe({
    // warning: coupling
    toast,
    onSuccess: (data) => {
      if (selectedAccount) {
        const accountData = {
          ...data,
          password: selectedAccount.password,
        };

        // set current account after crated
        setAccount(accountData);

        dispatch(accountData);
        // *********** this block can be in another creation hook
      }
    },
  });

  // re-use this function to login
  const { isLoadingGetToken, getToken } = useGetToken({
    toast,
    onSuccess: (data) => {
      setAccountToken({
        jwt: data.token,
      });
      getAccountInfo();
    },
  });

  const handleSelectAccount = (account: Account) => {
    setSelectedAccount(account);
    getToken({
      address: account.address,
      password: account.password,
    });
  };

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
        <HeaderCurrentMail />

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
              icon={<Avatar size={"sm"} name={account?.address} />}
            >
              Actions
            </MenuButton>
            <MenuList maxW={260}>
              <Box p={3} tabIndex={-1}>
                <Text color={"gray.400"}>You are signed in as</Text>
                <Text noOfLines={1} cursor={"pointer"}>
                  {/* should select onClick */}
                  {account?.address}
                </Text>
                <HStack>
                  <Text color={"gray.400"}>Password:</Text>
                  <Text>{account?.password}</Text>
                </HStack>
              </Box>
              <Divider />

              {accounts?.map((account) => (
                <MenuItem
                  key={account.id}
                  mb={2}
                  onClick={() => {
                    handleSelectAccount(account);
                  }}
                >
                  <Box mr={2}>
                    {account.id === selectedAccount?.id &&
                    (isLoadingGetToken || isLoadingAccountInfo) ? (
                      <Spinner size={"sm"} />
                    ) : (
                      <Avatar size={"xs"} name={account.address} />
                    )}
                  </Box>
                  <Text noOfLines={1}>{account.address}</Text>
                </MenuItem>
              ))}

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

      <CreateAccountDialog onClose={onClose} isOpen={isOpen} />

      <RemoveAccountDialog isOpen={isOpenDialog} onClose={closeDialog} />
    </>
  );
}
