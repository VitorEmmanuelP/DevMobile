import { useCallback, useEffect, useRef, useState } from 'react';

import { conversationRepository } from '../repositories/conversationRepository';
import { messageRepository } from '../repositories/messageRepository';
import { mqttService } from '../services/mqttService';
import { ConnectionStatus, Conversation, Message, MqttPayload, Settings } from '../types';

export interface UseMqtt {
  status: ConnectionStatus;
  lastIncoming: Message | null;
  sendMessage: (conversation: Conversation, body: string) => Promise<Message | null>;
  subscribe: (topic: string) => void;
  unsubscribe: (topic: string) => void;
}

export function useMqtt(settings: Settings | null): UseMqtt {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [lastIncoming, setLastIncoming] = useState<Message | null>(null);
  const settingsRef = useRef<Settings | null>(settings);
  settingsRef.current = settings;

  useEffect(() => {
    if (!settings) {
      return;
    }

    let cancelled = false;
    const offStatus = mqttService.onStatusChange(setStatus);
    setStatus(mqttService.getStatus());

    mqttService
      .connect({
        host: settings.brokerHost,
        port: settings.brokerPort,
        useSsl: settings.useSsl,
        clientId: settings.clientId,
      })
      .then(async () => {
        if (cancelled) {
          return;
        }
        const conversations = await conversationRepository.findAll();
        conversations.forEach((conversation) => mqttService.subscribe(conversation.topic));
      })
      .catch(() => {
        // RNF07: broker inválido/inacessível nunca derruba o app — só reflete o erro.
        if (!cancelled) {
          setStatus('error');
        }
      });

    return () => {
      cancelled = true;
      offStatus();
    };
  }, [settings]);

  useEffect(() => {
    const off = mqttService.onMessage(async (topic: string, payload: MqttPayload) => {
      const current = settingsRef.current;
      if (!current || payload.clientId === current.clientId) {
        return; // RN04: descarta o eco da própria mensagem.
      }
      const conversation = await conversationRepository.findByTopic(topic);
      if (!conversation) {
        return;
      }
      const message = await messageRepository.create({
        conversationId: conversation.id,
        sender: payload.sender,
        body: payload.body,
        direction: 'received',
      });
      setLastIncoming(message);
    });
    return off;
  }, []);

  const sendMessage = useCallback(
    async (conversation: Conversation, body: string): Promise<Message | null> => {
      const current = settingsRef.current;
      const trimmed = body.trim();
      if (!current || !trimmed) {
        return null; // RN09: não envia corpo vazio.
      }
      const message = await messageRepository.create({
        conversationId: conversation.id,
        sender: current.nickname,
        body: trimmed,
        direction: 'sent',
      });
      const payload: MqttPayload = {
        clientId: current.clientId,
        sender: current.nickname,
        body: trimmed,
        sentAt: message.createdAt,
      };
      mqttService.publish(conversation.topic, payload);
      return message;
    },
    []
  );

  const subscribe = useCallback((topic: string) => mqttService.subscribe(topic), []);
  const unsubscribe = useCallback((topic: string) => mqttService.unsubscribe(topic), []);

  return { status, lastIncoming, sendMessage, subscribe, unsubscribe };
}
