import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./store/authContext";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./store/themeContext";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 1000 * 60 * 5 } },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
  <BrowserRouter>
    <AuthProvider>
      <App />
      <Toaster
  position="top-right"
  toastOptions={{
    duration: 3000,
    style: {
      background: "hsl(var(--card))",
      color: "hsl(var(--foreground))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "10px",
      fontSize: "13px",
    },
  }}
/>
    </AuthProvider>
  </BrowserRouter>
</ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
