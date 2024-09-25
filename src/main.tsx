import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app.tsx";
import {
  Button,
  createTheme,
  MantineProvider,
  TimelineItem,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

const theme = createTheme({
  focusRing: "always",
  defaultRadius: 0,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <Notifications />
      <App />
    </MantineProvider>
  </StrictMode>,
);
