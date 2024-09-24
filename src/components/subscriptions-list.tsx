import { memo } from "react";
import { useMqttClient } from "../store/mqttClient";
import {
  useMantineTheme,
  Title,
  Text,
  Box,
  Timeline,
  Button,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconMessageX } from "./ui/icons";

export const SubscriptionsList = memo(function SubscriptionsList() {
  const client = useMqttClient((state) => state.client);
  const subscriptions = useMqttClient((state) => state.subscriptions);
  const removeSubscription = useMqttClient((state) => state.removeSubscription);
  const theme = useMantineTheme();
  const handleUnsubscribe = (topic: string) => {
    if (client) {
      client.unsubscribe(topic, (err) => {
        if (err) throw Error(err.message);

        removeSubscription(topic);
        notifications.show({
          title: <Title order={4}>Unsubscribed</Title>,
          message: <Text>Succesfully unsubcribed from {topic}</Text>,
        });
      });
    }
  };

  return (
    <Box my="xl">
      <Title order={4} mb="sm">
        Subscriptions
      </Title>
      <Timeline
        lineWidth={2}
        radius="lg"
        bulletSize={18}
        active={subscriptions.length}
      >
        {subscriptions.map((s) => (
          <Timeline.Item key={s.topic} title={s.topic}>
            <Text c="dimmed" size="sm">
              Subscribed to <strong>{s.topic}</strong>
            </Text>
            <Text size="xs" my={4}>
              QoS: {s.qos}
            </Text>
            <Button
              variant="outline"
              color="red"
              size="xs"
              leftSection={
                <IconMessageX style={{ fill: theme.colors.red[5] }} />
              }
              onClick={() => handleUnsubscribe(s.topic)}
            >
              Unsubscribe
            </Button>
          </Timeline.Item>
        ))}
      </Timeline>
    </Box>
  );
});
