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
  onClose: () => void;
  isOpen: boolean;
}

export interface Domain {
  // remove this @ fields
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
  message?: string;
}

export interface AccountTokenType {
  jwt: string;
}

export interface LoginAccountFields
  extends Pick<CreateAccountFields, "password"> {
  email: string;
}
