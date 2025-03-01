import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { queryClient } from "./config/query-client.js";
import { ConfigProvider } from "antd";
import "./i18n";

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#00235A",
          },
        }}
      >
        <App />
      </ConfigProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
