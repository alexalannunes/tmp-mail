import { Flex, useDisclosure } from "@chakra-ui/react";
import { CreateAccountDialog } from "../../features/account/create-account";
import { LoginAccountDialog } from "../../features/account/login-account";
import { RemoveAccountDialog } from "../../features/account/remove-account";
import { HeaderActions } from "./actions";
import { HeaderCurrentMail } from "./current-email";

export function Header() {
  const {
    isOpen: isCreateAccountOpen,
    onOpen: onCreateAccountOpen,
    onClose: onCreateAccountClose,
  } = useDisclosure();

  const {
    isOpen: isRemoveAccountOpen,
    onOpen: onRemoveAccountOpen,
    onClose: onRemoveAccountClose,
  } = useDisclosure();

  const {
    isOpen: isLoginAccountOpen,
    onOpen: onLoginAccountOpen,
    onClose: onLoginAccountClose,
  } = useDisclosure();

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

        <HeaderActions>
          <HeaderActions.ToggleThemeButton />
          <HeaderActions.MenuAccounts
            onCreateAccountOpen={onCreateAccountOpen}
            onLoginAccountOpen={onLoginAccountOpen}
            onRemoveAccountOpen={onRemoveAccountOpen}
          />
        </HeaderActions>
      </Flex>

      <CreateAccountDialog
        isOpen={isCreateAccountOpen}
        onClose={onCreateAccountClose}
      />

      <LoginAccountDialog
        isOpen={isLoginAccountOpen}
        onClose={onLoginAccountClose}
      />

      <RemoveAccountDialog
        isOpen={isRemoveAccountOpen}
        onClose={onRemoveAccountClose}
      />
    </>
  );
}
