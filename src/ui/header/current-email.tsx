import {
  Button,
  Flex,
  Icon,
  SlideFade,
  Tooltip,
  useClipboard,
} from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa6";

import { useAccount } from "../../data/context/account-context";

// we set a created email if no email was created
const email = "loading@email.com";

export function HeaderCurrentMail() {
  const account = useAccount();

  const { onCopy, hasCopied } = useClipboard(account?.address || "");
  return (
    <Flex alignItems={"center"} gap={2}>
      <Tooltip
        placement="bottom"
        label="Your temporary email address, click to copy"
      >
        <Button variant={"ghost"} size={"sm"} onClick={onCopy}>
          {account?.address ?? email}
        </Button>
      </Tooltip>
      <SlideFade offsetX={-20} offsetY={0} in={hasCopied}>
        <Icon as={FaCheck} color={"green.500"} _dark={{ color: "green.400" }} />
      </SlideFade>
    </Flex>
  );
}
