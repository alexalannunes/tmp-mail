import { RefObject } from "react";
export interface DomainFieldProps {
  onChange: (value: string) => void;
  value: string;
}

export interface CreateAccountFields {
  username: string;
  password: string;
  domain: string;
}

export interface CreateAccountDialogProps {
  // onOk: (values: CreateAccountFields) => void;
  onClose: () => void;
  isOpen: boolean;
}

export interface RemoveAccountDialogProps {
  onOk: () => void;
  onClose: () => void;
  isOpen: boolean;
  cancelRef: RefObject<HTMLButtonElement>;
}

// move to data types
export interface Domain {
  "@context": string;
  "@id": string;
  "@type": string;
  "hydra:totalItems": number;
  "hydra:member": {
    "@id": string;
    "@type": string;
    id: string;
    domain: string;
    isActive: boolean;
    isPrivate: boolean;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface CreateAccountRequest
  extends Omit<CreateAccountFields, "domain" | "username"> {
  address: string;
}

export interface GetTokenResponse {
  token: string;
  "@id": string;
  id: string;
}

export interface ErrorResponse {
  "@id": string;
  "@type": string;
  status: number;
  detail: string;
  "hydra:title": string;
  "hydra:description": string;
  type: string;
  title: string;
}
