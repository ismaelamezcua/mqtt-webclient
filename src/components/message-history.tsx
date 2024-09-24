import { memo } from "react";
import { useMqttClient } from "../store/mqttClient";
import { Box, Timeline, Title, Text, Button } from "@mantine/core";
import { IconChevronRight, IconMessageX } from "./ui/icons";

export const MessageHistory = memo(function MessageHistory() {
  const messages = useMqttClient((state) => state.messages);
  const clearMessages = useMqttClient((state) => state.clearMessages);

  return (
    <Box my="xl">
      <Title order={4} mb="sm">
        Message history
      </Title>
      <Timeline
        lineWidth={2}
        radius="lg"
        bulletSize={18}
        active={messages.length}
      >
        {messages.map((m) => (
          <Timeline.Item key={m.timestamp} title={m.message}>
            <Text c="dimmed" fw={700} size="xs" my={4}>
              Topic: {m.topic}
            </Text>
            <Text c="dimmed" size="xs" my={4}>
              Received at{" "}
              {new Date(Number(m.timestamp)).toLocaleString("es-MX")}
            </Text>
          </Timeline.Item>
        ))}
      </Timeline>
      {messages.length > 0 && (
        <Button
          mt="lg"
          color="red"
          leftSection={<IconMessageX style={{ fill: "white" }} />}
          rightSection={<IconChevronRight style={{ fill: "white" }} />}
          onClick={clearMessages}
        >
          Clear message history
        </Button>
      )}
    </Box>
  );
});
