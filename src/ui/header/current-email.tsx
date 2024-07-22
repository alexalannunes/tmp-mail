import {
  Button,
  Flex,
  Icon,
  SlideFade,
  Tooltip,
  useClipboard,
  useColorMode,
} from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa6";
import { MdMailOutline } from "react-icons/md";
import { useAccount } from "../../data/context/account-context";
import { useTranslation } from "react-i18next";

// we set a created email if no email was created
const email = "loading@email.com";

export function HeaderCurrentMail() {
  const account = useAccount();

  const { colorMode } = useColorMode();

  const { onCopy, hasCopied } = useClipboard(account?.address || "");

  const { t } = useTranslation();

  const getColorOnCopy = () => {
    if (colorMode === "dark") {
      if (hasCopied) return "green.300";

      return "white";
    }
    if (hasCopied) return "green.400";

    return "gray.700";
  };

  const colorOnCopy = getColorOnCopy();

  return (
    <Flex alignItems={"center"} gap={2}>
      <Icon as={MdMailOutline} color={colorOnCopy} />
      <Tooltip placement="bottom" label={t("header.copy_email")}>
        <Button
          variant={"ghost"}
          size={"sm"}
          onClick={onCopy}
          color={colorOnCopy}
        >
          {account?.address ?? email}
        </Button>
      </Tooltip>
      <SlideFade offsetX={-20} offsetY={0} in={hasCopied}>
        <Icon as={FaCheck} color={"green.400"} _dark={{ color: "green.300" }} />
      </SlideFade>
    </Flex>
  );
}
