import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.jsx";
import { MessageUserContextProvider } from "./context/MessageUserContext.jsx";
import { SocketIoContextProvider } from "./context/SocketIoContext.jsx";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SocketIoContextProvider>
        <MessageUserContextProvider>
          <App />
        </MessageUserContextProvider>
      </SocketIoContextProvider>
    </QueryClientProvider>
  </StrictMode>
);
