import { useForm } from "@mantine/form";
import { Message, useMqttClient } from "../store/mqttClient";
import { useDisclosure } from "@mantine/hooks";
import {
  Title,
  Text,
  useMantineTheme,
  Paper,
  Grid,
  TextInput,
  NumberInput,
  PasswordInput,
  Button,
  Accordion,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import mqtt from "mqtt";
import { IconChevronRight, IconServer } from "./ui/icons";
import { useEffect } from "react";

export default function ServerConnection() {
  const client = useMqttClient((state) => state.client);
  const clientConnect = useMqttClient((state) => state.clientConnect);
  const clientDisconnect = useMqttClient((state) => state.clientDisconnect);
  const addMessage = useMqttClient((state) => state.addMessage);
  const form = useForm({
    initialValues: {
      broker: "broker.emqx.io",
      port: 8083,
      clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
      username: "emqx_test",
      password: "emqx_test",
    },
  });
  const [loadingConnect, loadingConnectActions] = useDisclosure(false);
  const [loadingDisconnect, loadingDisconnectActions] = useDisclosure(false);
  const theme = useMantineTheme();
  const handleConnect = () => {
    const { broker, port, clientId, username, password } = form.values;
    const url = `ws://${broker}:${port}/mqtt`;

    const options = {
      clean: true,
      connectTimeout: 4000,
      clientId,
      username,
      password,
    };

    // Load state for connect button
    loadingConnectActions.open();

    const client = mqtt.connect(url, options);
    client.on("connect", () => {
      loadingConnectActions.close();
      clientConnect(client);
      notifications.show({
        title: <Title order={4}>Connected with server</Title>,
        message: (
          <Text>
            The connection was succesfully established with broker: {url}
          </Text>
        ),
      });
    });
  };
  const handleDisconnect = () => {
    loadingDisconnectActions.open();

    if (client) {
      client.end(false, {}, () => {
        loadingDisconnectActions.close();
        clientDisconnect();
        notifications.show({
          title: <Title order={4}>Disconnected from server</Title>,
          message: (
            <Text>
              The connection with the broker was succesfully finished.
            </Text>
          ),
          color: "red",
        });
      });
    }
  };

  useEffect(() => {
    if (client) {
      client.on("message", (topic, payload) => {
        const message: Message = {
          topic,
          message: payload.toString(),
          timestamp: Date.now().toString(),
        };

        addMessage(message);
      });

      client.on("error", (err) => {
        console.error(`Error: ${err}`);
      });
    }
  }, [client]);

  if (!client) {
    return (
      <>
        <Title order={3}>Server connection</Title>
        <Text>
          It seems that you are not connected to a MQTT broker. Provide the
          following credentials to connect to one.
        </Text>

        <Title order={5} mt="lg" mb="xs">
          Server configuration
        </Title>
        <Paper shadow="sm" radius="sm" p="lg" bg="teal.0">
          <form onSubmit={form.onSubmit(handleConnect)}>
            <Grid>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <TextInput
                  label="MQTT broker address"
                  {...form.getInputProps("broker")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <NumberInput
                  label="MQTT port"
                  {...form.getInputProps("port")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <TextInput
                  label="Client ID"
                  {...form.getInputProps("clientId")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <TextInput
                  label="Username"
                  placeholder="username"
                  {...form.getInputProps("username")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <PasswordInput
                  label="Passowrd"
                  {...form.getInputProps("password")}
                />
              </Grid.Col>
            </Grid>
            <Button
              type="submit"
              leftSection={<IconServer style={{ fill: "white" }} />}
              rightSection={<IconChevronRight style={{ fill: "white" }} />}
              loading={loadingConnect}
              mt="lg"
              color="teal"
            >
              Connect
            </Button>
          </form>
        </Paper>
      </>
    );
  }

  return (
    <>
      <Title order={3}>Server connection</Title>
      <Accordion>
        <Accordion.Item value="Server connected.">
          <Accordion.Control icon={<IconServer />}>
            Server connected.
          </Accordion.Control>
          <Accordion.Panel>
            <Text pb="sm">
              The server is currently connected. Use the following button to
              disconnect.
            </Text>
            <Button
              leftSection={<IconServer style={{ fill: theme.colors.red[5] }} />}
              rightSection={
                <IconChevronRight style={{ fill: theme.colors.red[5] }} />
              }
              onClick={handleDisconnect}
              loading={loadingDisconnect}
              color="red"
              variant="light"
            >
              Disconnect
            </Button>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
