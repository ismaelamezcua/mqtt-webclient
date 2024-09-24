import { Container, Divider, Paper, Title } from "@mantine/core";
import ServerConnection from "./components/server-connection";
import ServerSubscriptions from "./components/server-subscriptions";
import ServerMessages from "./components/server-messages";

function App() {
  return (
    <>
      <Container py="xl">
        <Paper shadow="sm" radius="sm" p="lg">
          <Title order={1}>MQTT WebClient</Title>
          <Divider my="md" />
          <ServerConnection />
          <ServerSubscriptions />
          <ServerMessages />
        </Paper>
      </Container>
    </>
  );
}

export default App;
