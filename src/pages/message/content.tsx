import { Box, SkeletonText } from "@chakra-ui/react";
import { useMessage } from "./use-message";
import { useMessageView } from "./message-context";

export function MessageContent() {
  const message = useMessageView();
  const { isLoadingMessage } = useMessage();

  return (
    <SkeletonText
      noOfLines={4}
      mt={10}
      spacing="4"
      skeletonHeight="4"
      isLoaded={!isLoadingMessage}
    >
      <Box>
        {message?.html?.map((html, index) => (
          <Box
            color="gray.800"
            key={index}
            dangerouslySetInnerHTML={{
              __html: html,
            }}
          />
        ))}
      </Box>
    </SkeletonText>
  );
}
