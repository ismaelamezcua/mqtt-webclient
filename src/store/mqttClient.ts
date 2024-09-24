import { MqttClient } from "mqtt";
import { create } from "zustand";

export type Message = {
  message: string;
  topic: string;
  timestamp: string;
};

export type Subscription = {
  topic: string;
  qos: number;
};

export type State = {
  client: MqttClient | undefined;
  subscriptions: Subscription[];
  messages: Message[];
};

export type Actions = {
  clientConnect: (client: MqttClient) => void;
  clientDisconnect: () => void;
  addSubscription: (subscription: Subscription) => void;
  removeSubscription: (topic: string) => void;
  clearSubscriptions: () => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
};

export const useMqttClient = create<State & Actions>((set, get) => ({
  client: undefined,
  subscriptions: [],
  messages: [],
  clientConnect: (client: MqttClient) => {
    set({ client: client });
  },
  clientDisconnect: () => {
    set({ client: undefined });
  },
  addSubscription: (subscription: Subscription) => {
    set((state: State) => ({
      subscriptions: [...state.subscriptions, subscription as Subscription],
    }));
  },
  removeSubscription: (topic: string) => {
    const { subscriptions } = get();
    set({
      subscriptions: subscriptions.filter(
        (subscription: Subscription) => subscription.topic != topic,
      ),
    });
  },
  clearSubscriptions: () => {
    set({ subscriptions: [] });
  },
  addMessage: (message: Message) => {
    set((state: State) => ({
      messages: [...state.messages, message as Message],
    }));
  },
  clearMessages: () => {
    set({ messages: [] });
  },
}));
