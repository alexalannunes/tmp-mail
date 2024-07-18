import {
  Avatar,
  Box,
  Divider,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { IconType } from "react-icons";
import { FaMoon, FaSun } from "react-icons/fa";
import { MdDelete, MdPerson, MdPersonAddAlt1 } from "react-icons/md";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";
import {
  Account,
  useAccount,
  useAccountDispatch,
} from "../../data/context/account-context";
import { AccountTokenType } from "../../features/account/types";
import { useGetMe } from "../../hooks/account/use-get-me";
import { useGetToken } from "../../hooks/account/use-get-token";
import { LocalStorageKeys } from "../../storage/keys";
import { SelectableText } from "./selectable-text";

function MenuItemContent({ icon, label }: { icon: IconType; label: string }) {
  return (
    <HStack spacing={4} alignItems={"center"}>
      <Icon
        as={icon}
        color={"gray.400"}
        _dark={{
          color: "gray.500",
        }}
        fontSize={"1.1rem"}
      />
      <Text>{label}</Text>
    </HStack>
  );
}

export function HeaderActions({ children }: { children: ReactNode }) {
  return <HStack>{children}</HStack>;
}

function ToggleThemeButton() {
  const { toggleColorMode, colorMode } = useColorMode();

  const iconTheme = colorMode === "dark" ? <FaSun /> : <FaMoon />;

  return (
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
  );
}

interface HeaderActionsProps {
  onCreateAccountOpen: () => void;
  onLoginAccountOpen: () => void;
  onRemoveAccountOpen: () => void;
}

function MenuAccounts({
  onCreateAccountOpen,
  onLoginAccountOpen,
  onRemoveAccountOpen,
}: HeaderActionsProps) {
  const account = useAccount();
  const accounts = useReadLocalStorage<Account[]>(LocalStorageKeys.ACCOUNTS);

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const [, setAccount] = useLocalStorage<Account | undefined>(
    LocalStorageKeys.ACCOUNT,
    undefined
  );

  const [, setAccountToken] = useLocalStorage<AccountTokenType>(
    LocalStorageKeys.TOKEN,
    { jwt: "" }
  );

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
    <Menu>
      <MenuButton
        as={IconButton}
        variant={"ghost"}
        rounded={"full"}
        aria-label="Menu accounts"
        icon={<Avatar size={"sm"} name={account?.address} />}
      />
      <MenuList maxW={260}>
        <Box p={3} tabIndex={-1}>
          <Text color={"gray.400"} fontSize={"small"}>
            You are signed in as:
          </Text>
          <SelectableText text={account?.address || ""} />
          <HStack>
            <Text color={"gray.400"} fontSize={"14px"}>
              Password:
            </Text>
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

        <Divider />
        <MenuItem onClick={onCreateAccountOpen}>
          <MenuItemContent icon={MdPersonAddAlt1} label={"Create an account"} />
        </MenuItem>
        <MenuItem onClick={onLoginAccountOpen}>
          <MenuItemContent icon={MdPerson} label={"Login"} />
        </MenuItem>
        <MenuItem
          onClick={onRemoveAccountOpen}
          _hover={{
            color: "red.400",
          }}
        >
          <MenuItemContent icon={MdDelete} label="Delete account" />
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

HeaderActions.ToggleThemeButton = ToggleThemeButton;
HeaderActions.MenuAccounts = MenuAccounts;
