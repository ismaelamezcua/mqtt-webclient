import { useForm } from "@mantine/form";
import { useMqttClient } from "../store/mqttClient";
import {
  Button,
  Grid,
  NumberInput,
  Paper,
  Select,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { IconChevronRight, IconMessageAdd } from "./ui/icons";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { MessageHistory } from "./message-history";

export default function ServerMessages() {
  const client = useMqttClient((state) => state.client);
  const [loadingPublish, loadingPublishActions] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      message: "",
      topic: "",
      qos: 0,
    },
  });
  const handlePublish = () => {
    const { topic, message } = form.values;

    loadingPublishActions.open();

    if (client) {
      client.publish(topic, message, (err) => {
        loadingPublishActions.close();

        if (err) throw Error(err.message);
        form.reset();
        notifications.show({
          title: <Title order={4}>Message published</Title>,
          message: <Text>The message was sent.</Text>,
        });
      });
    }
  };

  if (!client) {
    return <></>;
  }

  return (
    <>
      <Title order={3}>Messages</Title>
      <Paper shadow="sm" radius="sm" p="lg" bg="gray.0">
        <form onSubmit={form.onSubmit(handlePublish)}>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput label="Topic" {...form.getInputProps("topic")} required />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Select
                label="QoS (Quality of Service"
                data={[
                  { value: "0", label: "0 - At most once" },
                  { value: "1", label: "1 - At least once" },
                  { value: "2", label: "2 - Exactly once" },
                ]}
                allowDeselect={false}
                defaultValue={"0"}
                {...form.getInputProps("qos")}
                required
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea {...form.getInputProps("message")} required />
            </Grid.Col>
          </Grid>
          <Button
            type="submit"
            leftSection={<IconMessageAdd style={{ fill: "white" }} />}
            rightSection={<IconChevronRight style={{ fill: "white" }} />}
            loading={loadingPublish}
            mt="lg"
            color="blue"
          >
            Publish message
          </Button>
        </form>
      </Paper>
      <MessageHistory />
    </>
  );
}
