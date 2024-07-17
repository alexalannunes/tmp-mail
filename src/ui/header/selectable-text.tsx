import { useRef } from "react";
import { Text } from "@chakra-ui/react";

export function SelectableText({ text }: { text: string }) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const handleSelectText = () => {
    if (textRef.current) {
      const range = document.createRange();
      range.selectNode(textRef.current);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
    }
  };
  return (
    <Text cursor={"pointer"} onClick={handleSelectText} ref={textRef}>
      {text}
    </Text>
  );
}
