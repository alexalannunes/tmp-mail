import { useEffect } from "react";

export function usePageTitle(title = "Tmp.mail") {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
