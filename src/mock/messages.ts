export interface Message {
  "@context": string;
  "@id": string;
  "@type": string;
  "hydra:totalItems": number;
  "hydra:member": Array<{
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
    subject: string;
    intro: string;
    seen: boolean;
    isDeleted: boolean;
    hasAttachments: boolean;
    size: number;
    downloadUrl: string;
    sourceUrl: string;
    createdAt: string;
    updatedAt: string;
    accountId: string;
    html?: string[];
  }>;
}

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

export const messages: Message = {
  "@context": "/contexts/Message",
  "@id": "/messages",
  "@type": "hydra:Collection",
  "hydra:totalItems": 1,
  "hydra:member": [
    {
      "@id": "/messages/6697edb472e38ada74de9b5a",
      "@type": "Message",
      id: "6697edb472e38ada74de9b5a",
      msgid:
        "\u003CCAPheRz_3Hf6H0raoBYaa7DjKnV3LYXsYqWyVFcaLF6iiDFJ=YQ@mail.gmail.com\u003E",
      from: {
        address: "alexalannunes@gmail.com",
        name: "Alex Alan Nunes",
      },
      to: [
        {
          address: "alexalannunes@belgianairways.com",
          name: "",
        },
      ],
      subject: "Assunto do email",
      intro: "*conteúdo* do email",
      seen: false,
      isDeleted: false,
      hasAttachments: false,
      size: 3448,
      downloadUrl: "/messages/6697edb472e38ada74de9b5a/download",
      sourceUrl: "/sources/6697edb472e38ada74de9b5a",
      createdAt: "2024-07-17T16:13:24+00:00",
      updatedAt: "2024-07-17T16:13:40+00:00",
      accountId: "/accounts/6693e6178dfb67ed9d0272b2",
    },
  ],
};
