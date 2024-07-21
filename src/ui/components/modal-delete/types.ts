import { ReactNode } from "react";

export interface DeleteModalProps {
  onClose: () => void;
  onOk: () => void;
  title: string;
  content?: ReactNode;
  isOpen: boolean;
  isLoading?: boolean;
}
