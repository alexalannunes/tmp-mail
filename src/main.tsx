import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
  ChakraProvider,
  extendTheme,
  StyleFunctionProps,
} from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import App from "./App.tsx";
import { InboxPage } from "./pages/inbox/inbox.tsx";
import { AccountProvider } from "./data/context/account-provider.tsx";
import { MessagePage } from "./pages/message/message.tsx";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const theme = extendTheme({
  styles: {
    global: (props: Record<string, any> | StyleFunctionProps) => ({
      body: {
        fontFamily: "sans-serif",
      },
      "*::placeholder": {
        color: mode("gray.400", "whiteAlpha.400")(props),
      },
      "*, *::before, &::after": {
        borderColor: mode("gray.200", "whiteAlpha.300")(props),
        wordWrap: "break-word",
      },
    }),
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={client}>
        <ChakraProvider theme={theme}>
          <AccountProvider>
            <Routes>
              <Route path="/" element={<App />}>
                <Route index element={<InboxPage />} />
                <Route path="/message/:messageId" element={<MessagePage />} />
              </Route>
            </Routes>
          </AccountProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
