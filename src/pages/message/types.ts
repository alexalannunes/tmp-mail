export interface MessageView {
  "@context": string;
  "@id": string;
  "@type": string;
  id: string;
  msgid: string;
  from: {
    address: string;
    name: string;
  };
  to: Array<{
    address: string;
    name: string;
  }>;
  cc: Array<any>;
  bcc: Array<any>;
  subject: string;
  seen: boolean;
  flagged: boolean;
  isDeleted: boolean;
  verifications: {
    tls: {
      name: string;
      standardName: string;
      version: string;
    };
    spf: boolean;
    dkim: boolean;
  };
  retention: boolean;
  retentionDate: string;
  html: Array<string>;
  hasAttachments: boolean;
  size: number;
  downloadUrl: string;
  sourceUrl: string;
  createdAt: string;
  updatedAt: string;
  accountId: string;
}

export interface MessageViewActions {
  isDeleteMessageOpen: boolean;
  onDeleteMessageClose: () => void;
  onDeleteMessageOpen: () => void;
}
