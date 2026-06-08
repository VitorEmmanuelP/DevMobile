import mqtt, { MqttClient } from 'mqtt';

import { appError } from '../appError';
import { ConnectionStatus, MqttConnectConfig, MqttPayload } from '../types';

type MessageCallback = (topic: string, payload: MqttPayload) => void;
type StatusCallback = (status: ConnectionStatus) => void;

export interface MqttService {
  connect(config: MqttConnectConfig): Promise<void>;
  disconnect(): void;
  subscribe(topic: string): void;
  unsubscribe(topic: string): void;
  publish(topic: string, payload: MqttPayload): void;
  onMessage(cb: MessageCallback): () => void;
  getStatus(): ConnectionStatus;
  onStatusChange(cb: StatusCallback): () => void;
}

let client: MqttClient | null = null;
let status: ConnectionStatus = 'disconnected';

const messageListeners = new Set<MessageCallback>();
const statusListeners = new Set<StatusCallback>();

function setStatus(next: ConnectionStatus): void {
  status = next;
  statusListeners.forEach((cb) => cb(next));
}

function connect(config: MqttConnectConfig): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      if (client) {
        client.end(true);
        client = null;
      }

      const protocol = config.useSsl ? 'wss' : 'ws';
      const url = `${protocol}://${config.host}:${config.port}/mqtt`;

      setStatus('connecting');
      let settled = false;

      const c = mqtt.connect(url, {
        clientId: config.clientId,
        reconnectPeriod: 5000,
      });
      client = c;

      c.on('connect', () => {
        setStatus('connected');
        if (!settled) {
          settled = true;
          resolve();
        }
      });

      c.on('reconnect', () => setStatus('connecting'));
      c.on('close', () => setStatus('disconnected'));

      c.on('error', (err) => {
        setStatus('error');
        if (!settled) {
          settled = true;
          c.end(true);
          client = null;
          reject(appError('CONNECTION_FAILED', err?.message ?? 'Falha ao conectar ao broker.'));
        }
      });

      c.on('message', (topic, payloadBuffer) => {
        try {
          const payload = JSON.parse(payloadBuffer.toString()) as MqttPayload;
          messageListeners.forEach((cb) => cb(topic, payload));
        } catch {
          // payload inválido: ignora (contrato do MqttService)
        }
      });
    } catch (err) {
      setStatus('error');
      reject(appError('CONNECTION_FAILED', 'Não foi possível iniciar a conexão com o broker.'));
    }
  });
}

function disconnect(): void {
  if (client) {
    client.end(true);
    client = null;
  }
  setStatus('disconnected');
}

function subscribe(topic: string): void {
  client?.subscribe(topic);
}

function unsubscribe(topic: string): void {
  client?.unsubscribe(topic);
}

function publish(topic: string, payload: MqttPayload): void {
  client?.publish(topic, JSON.stringify(payload));
}

function onMessage(cb: MessageCallback): () => void {
  messageListeners.add(cb);
  return () => messageListeners.delete(cb);
}

function getStatus(): ConnectionStatus {
  return status;
}

function onStatusChange(cb: StatusCallback): () => void {
  statusListeners.add(cb);
  return () => statusListeners.delete(cb);
}

export const mqttService: MqttService = {
  connect,
  disconnect,
  subscribe,
  unsubscribe,
  publish,
  onMessage,
  getStatus,
  onStatusChange,
};
