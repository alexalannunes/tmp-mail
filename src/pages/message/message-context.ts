import { createContext, useContext } from "react";
import { MessageView, MessageViewActions } from "./types";

export const MessageViewContext = createContext<MessageView>({} as MessageView);

MessageViewContext.displayName = "MessageViewContext";

export const MessageViewActionsContext = createContext<MessageViewActions>({
  isDeleteMessageOpen: false,
  onDeleteMessageClose: () => {},
  onDeleteMessageOpen: () => {},
});

MessageViewActionsContext.displayName = "MessageViewActionsContext";

export function useMessageView() {
  const context = useContext(MessageViewContext);
  if (context === undefined) {
    throw new Error("useMessage must be inside of MessageViewContext");
  }
  return context;
}

export function useMessageActionsView() {
  const context = useContext(MessageViewActionsContext);
  if (context === undefined) {
    throw new Error(
      "useMessageActionsView must be inside of MessageViewActionsContext"
    );
  }
  return context;
}
