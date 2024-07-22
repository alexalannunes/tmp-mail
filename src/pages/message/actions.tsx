import { Button, HStack } from "@chakra-ui/react";
import { MdDeleteOutline, MdOutlineMessage } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { LocalStorageKeys } from "../../storage/keys";
import { useLocalStorage } from "usehooks-ts";
import { useTranslation } from "react-i18next";
import { useMessageActionsView } from "./message-context";

export function MessageActions() {
  const { messageId } = useParams();

  const { onDeleteMessageOpen } = useMessageActionsView();

  const [, setReadMessages] = useLocalStorage<string[]>(
    LocalStorageKeys.READ,
    []
  );

  const { t } = useTranslation();

  const navigate = useNavigate();

  const handleMarkAsUnread = () => {
    setReadMessages((prev) => prev.filter((msgId) => msgId !== messageId));
    navigate("/");
  };

  return (
    <HStack>
      <Button
        size="sm"
        variant={"outline"}
        colorScheme="cyan"
        leftIcon={<MdOutlineMessage />}
        onClick={handleMarkAsUnread}
      >
        {t("message.mark_as_unread")}
      </Button>
      <Button
        size="sm"
        variant={"outline"}
        colorScheme="red"
        leftIcon={<MdDeleteOutline />}
        onClick={onDeleteMessageOpen}
      >
        {t("message.delete")}
      </Button>
    </HStack>
  );
}
