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
  const qosLevels = [
    "0 - At most once",
    "1 - At least once",
    "2 - Exactly once",
  ];

  return (
    <Box my="xl">
      <Title order={4} mb="sm">
        Subscriptions
      </Title>
      {subscriptions.length === 0 && <Text>No current subscriptions.</Text>}
      <Timeline
        lineWidth={2}
        radius="lg"
        bulletSize={18}
        active={subscriptions.length}
      >
        {subscriptions.map(({ topic, qos }) => (
          <Timeline.Item key={topic} title={topic}>
            <Text c="dimmed" size="sm">
              Subscribed to <strong>{topic}</strong>
            </Text>
            <Text size="xs" my={4}>
              QoS: {qosLevels[qos]}
            </Text>
            <Button
              variant="outline"
              color="red"
              size="xs"
              leftSection={
                <IconMessageX style={{ fill: theme.colors.red[5] }} />
              }
              onClick={() => handleUnsubscribe(topic)}
            >
              Unsubscribe
            </Button>
          </Timeline.Item>
        ))}
      </Timeline>
    </Box>
  );
});
