import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { usePageTitle } from "../../hooks/app/use-page-title";
import { MessageActions } from "./actions";
import { MessageContent } from "./content";
import { MessageFromInfo } from "./from-info";
import {
  MessageViewActionsContext,
  MessageViewContext,
} from "./message-context";
import { RemoveMessage } from "./remove-message";
import { MessageTitle } from "./title";
import { useMessage } from "./use-message";

export function MessagePage() {
  const {
    isOpen: isDeleteMessageOpen,
    onClose: onDeleteMessageClose,
    onOpen: onDeleteMessageOpen,
  } = useDisclosure();

  const { message } = useMessage();

  usePageTitle(message?.subject);

  return (
    <MessageViewActionsContext.Provider
      value={{
        isDeleteMessageOpen,
        onDeleteMessageClose,
        onDeleteMessageOpen,
      }}
    >
      <MessageViewContext.Provider value={message}>
        <Box p={7}>
          <Flex alignItems={"center"} justifyContent={"space-between"}>
            <MessageTitle />
            <MessageActions />
          </Flex>

          <Box mt={4} padding="6" bg="white" rounded={"md"}>
            <MessageFromInfo />
            <MessageContent />
          </Box>
        </Box>
      </MessageViewContext.Provider>
      <RemoveMessage />
    </MessageViewActionsContext.Provider>
  );
}
