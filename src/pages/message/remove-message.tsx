import { useNavigate, useParams } from "react-router-dom";
import { DeleteModal } from "../../ui/components/modal-delete/modal-delete";
import { useDeleteMessage } from "./use-delete-message";
import { useMessages } from "../inbox/inbox";
import { useMessageActionsView } from "./message-context";

export function RemoveMessage() {
  const { messageId } = useParams();
  const { onDeleteMessageClose, isDeleteMessageOpen } = useMessageActionsView();
  const navigate = useNavigate();
  const { refetch } = useMessages();

  const { deleteMessage, isDeleteMessageLoading } = useDeleteMessage({
    onSuccess: () => {
      onDeleteMessageClose();
      refetch();
      navigate("/");
    },
  });

  const handleOk = () => {
    if (messageId) {
      deleteMessage(messageId);
    }
  };

  return (
    <DeleteModal
      title="Delete message"
      onClose={onDeleteMessageClose}
      isOpen={isDeleteMessageOpen}
      isLoading={isDeleteMessageLoading}
      onOk={handleOk}
    />
  );
}
