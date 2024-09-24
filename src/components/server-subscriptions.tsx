import {
  Button,
  Grid,
  Paper,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useMqttClient } from "../store/mqttClient";
import { useForm } from "@mantine/form";
import { IconChevronRight, IconServer } from "./ui/icons";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { SubscriptionsList } from "./subscriptions-list";

export default function ServerSubscriptions() {
  const form = useForm({
    initialValues: {
      topic: "",
      qos: 0,
    },
    validate: {
      topic: (value) =>
        value.length > 3 ? null : "Provide a topic with at least 3 characters.",
    },
  });
  const client = useMqttClient((state) => state.client);
  const subscriptions = useMqttClient((state) => state.subscriptions);
  const addSubscription = useMqttClient((state) => state.addSubscription);
  const [loadingSubscribe, loadingSubscribeActions] = useDisclosure(false);
  const handleSubscribe = () => {
    loadingSubscribeActions.open();

    const { topic, qos } = form.values;
    const isAlreadySubscribed = subscriptions.find(
      (subscription) => subscription.topic === topic,
    );

    if (isAlreadySubscribed) {
      loadingSubscribeActions.close();
      notifications.show({
        title: <Title order={4}>Already subscribed</Title>,
        message: (
          <Text>
            You provided a topic to which the client is already subscribed to.
          </Text>
        ),
        color: "red",
      });
      return;
    }

    if (client) {
      // The QoS options requires to import `mqtt-packet` to use the `QoS` type.
      // Currently not being used.
      client.subscribe(topic, (err) => {
        if (err) {
          throw new Error(err.message);
        }

        addSubscription({ topic, qos });
        notifications.show({
          title: <Title order={4}>Subscribed</Title>,
          message: (
            <Text>
              The client subscribed to <strong>{topic}</strong> succesfully.
            </Text>
          ),
        });
      });
    }
    form.reset();
    loadingSubscribeActions.close();
  };

  if (!client) {
    return <></>;
  }

  return (
    <>
      <Title order={3}>Subscriptions</Title>
      <Paper shadow="sm" radius="sm" p="lg" bg="gray.0">
        <form onSubmit={form.onSubmit(handleSubscribe)}>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Topic"
                {...form.getInputProps("topic")}
                required
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Select
                label="QoS (Quality of Service)"
                placeholder="Optional"
                data={[
                  { value: "0", label: "0 - At most once" },
                  { value: "1", label: "1 - At least once" },
                  { value: "2", label: "2 - Exactly once" },
                ]}
                allowDeselect={false}
                defaultValue={"0"}
                {...form.getInputProps("qos")}
              />
            </Grid.Col>
          </Grid>
          <Button
            type="submit"
            leftSection={<IconServer style={{ fill: "white" }} />}
            rightSection={<IconChevronRight style={{ fill: "white" }} />}
            loading={loadingSubscribe}
            mt="lg"
            color="blue"
          >
            Subscribe
          </Button>
        </form>
      </Paper>
      <SubscriptionsList />
    </>
  );
}
