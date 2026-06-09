import { act, renderHook, waitFor } from '@testing-library/react-native';

import { Conversation, Message, MqttPayload, Settings } from '../types';

jest.mock('../services/mqttService', () => ({
  mqttService: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
    publish: jest.fn(),
    onMessage: jest.fn(),
    getStatus: jest.fn(),
    onStatusChange: jest.fn(),
  },
}));

jest.mock('../repositories/conversationRepository', () => ({
  conversationRepository: {
    findAll: jest.fn(),
    findByTopic: jest.fn(),
  },
}));

jest.mock('../repositories/messageRepository', () => ({
  messageRepository: {
    create: jest.fn(),
  },
}));

import { conversationRepository } from '../repositories/conversationRepository';
import { messageRepository } from '../repositories/messageRepository';
import { mqttService } from '../services/mqttService';
import { useMqtt } from './useMqtt';

const mqtt = mqttService as jest.Mocked<typeof mqttService>;
const convRepo = conversationRepository as jest.Mocked<typeof conversationRepository>;
const msgRepo = messageRepository as jest.Mocked<typeof messageRepository>;

const settings: Settings = {
  nickname: 'Eu',
  brokerHost: 'broker.hivemq.com',
  brokerPort: 8884,
  useSsl: true,
  clientId: 'meu-client-id',
};

const conversation: Conversation = {
  id: 'c1',
  name: 'Sala 1',
  topic: 'mensagemmqtt/sala1',
  createdAt: '2026-06-03T14:22:05.123Z',
};

type MessageCb = (topic: string, payload: MqttPayload) => void | Promise<void>;

function captureMessageCallback(): () => MessageCb {
  let cb: MessageCb = () => {};
  mqtt.onMessage.mockImplementation((handler: MessageCb) => {
    cb = handler;
    return jest.fn();
  });
  return () => cb;
}

beforeEach(() => {
  mqtt.onStatusChange.mockReturnValue(jest.fn());
  mqtt.getStatus.mockReturnValue('disconnected');
  mqtt.onMessage.mockReturnValue(jest.fn());
  mqtt.connect.mockResolvedValue(undefined);
  convRepo.findAll.mockResolvedValue([]);
  convRepo.findByTopic.mockResolvedValue(null);
});

describe('useMqtt', () => {
  describe('Conexao e RNF07', () => {
    it('deve conectar uma unica vez e assinar os topicos das conversas salvas', async () => {
      // Bug que pega: nao assinar os topicos existentes apos conectar (nada chega).
      convRepo.findAll.mockResolvedValue([
        conversation,
        { ...conversation, id: 'c2', topic: 'mensagemmqtt/sala2' },
      ]);

      renderHook(() => useMqtt(settings));

      await waitFor(() => expect(convRepo.findAll).toHaveBeenCalled());
      expect(mqtt.connect).toHaveBeenCalledTimes(1);
      expect(mqtt.connect).toHaveBeenCalledWith({
        host: settings.brokerHost,
        port: settings.brokerPort,
        useSsl: settings.useSsl,
        clientId: settings.clientId,
      });
      await waitFor(() => expect(mqtt.subscribe).toHaveBeenCalledWith('mensagemmqtt/sala1'));
      expect(mqtt.subscribe).toHaveBeenCalledWith('mensagemmqtt/sala2');
    });

    it('NAO deve conectar enquanto settings for null', () => {
      // Bug que pega: tentar conectar sem configuracao (primeira abertura do app).
      renderHook(() => useMqtt(null));

      expect(mqtt.connect).not.toHaveBeenCalled();
    });

    it('deve refletir status "error" sem derrubar quando o connect rejeita (RNF07)', async () => {
      // Bug que pega: deixar a rejeicao do connect (broker invalido) propagar e travar o app.
      mqtt.connect.mockRejectedValue(
        Object.assign(new Error('falhou'), { code: 'CONNECTION_FAILED' })
      );

      const { result } = renderHook(() => useMqtt(settings));

      await waitFor(() => expect(result.current.status).toBe('error'));
    });
  });

  describe('Recebimento e descarte do eco (RN04)', () => {
    it('deve ignorar o eco da propria mensagem (mesmo clientId) sem salvar', async () => {
      // Bug que pega: salvar a propria mensagem de volta (RN04 - mensagem duplicada).
      const getCb = captureMessageCallback();
      renderHook(() => useMqtt(settings));

      await waitFor(() => expect(mqtt.onMessage).toHaveBeenCalled());
      await act(async () => {
        await getCb()('mensagemmqtt/sala1', {
          clientId: 'meu-client-id',
          sender: 'Eu',
          body: 'eco',
          sentAt: '2026-06-03T14:22:05.123Z',
        });
      });

      expect(msgRepo.create).not.toHaveBeenCalled();
    });

    it('deve salvar como recebida a mensagem de outro clientId e expor em lastIncoming', async () => {
      // Bug que pega: nao persistir/rotear mensagens de terceiros para a conversa do topico.
      const getCb = captureMessageCallback();
      convRepo.findByTopic.mockResolvedValue(conversation);
      const created: Message = {
        id: 'rx1',
        conversationId: 'c1',
        sender: 'Bruna',
        body: 'oi',
        direction: 'received',
        createdAt: '2026-06-03T14:30:00.000Z',
      };
      msgRepo.create.mockResolvedValue(created);

      const { result } = renderHook(() => useMqtt(settings));
      await waitFor(() => expect(mqtt.onMessage).toHaveBeenCalled());

      await act(async () => {
        await getCb()('mensagemmqtt/sala1', {
          clientId: 'outro-client-id',
          sender: 'Bruna',
          body: 'oi',
          sentAt: '2026-06-03T14:30:00.000Z',
        });
      });

      expect(convRepo.findByTopic).toHaveBeenCalledWith('mensagemmqtt/sala1');
      expect(msgRepo.create).toHaveBeenCalledWith({
        conversationId: 'c1',
        sender: 'Bruna',
        body: 'oi',
        direction: 'received',
      });
      await waitFor(() => expect(result.current.lastIncoming).toEqual(created));
    });

    it('NAO deve salvar quando o topico recebido nao corresponde a nenhuma conversa', async () => {
      // Bug que pega: criar mensagem com conversationId invalido para topico desconhecido.
      const getCb = captureMessageCallback();
      convRepo.findByTopic.mockResolvedValue(null);
      renderHook(() => useMqtt(settings));
      await waitFor(() => expect(mqtt.onMessage).toHaveBeenCalled());

      await act(async () => {
        await getCb()('topico/desconhecido', {
          clientId: 'outro',
          sender: 'X',
          body: 'oi',
          sentAt: '2026-06-03T14:30:00.000Z',
        });
      });

      expect(msgRepo.create).not.toHaveBeenCalled();
    });
  });

  describe('Envio (sendMessage)', () => {
    it('deve persistir a mensagem como sent e publicar o payload com o proprio clientId', async () => {
      // Bug que pega: publicar com clientId/sender errados, quebrando o filtro de eco do destinatario.
      const created: Message = {
        id: 's1',
        conversationId: 'c1',
        sender: 'Eu',
        body: 'fala',
        direction: 'sent',
        createdAt: '2026-06-03T15:00:00.000Z',
      };
      msgRepo.create.mockResolvedValue(created);

      const { result } = renderHook(() => useMqtt(settings));
      await waitFor(() => expect(mqtt.connect).toHaveBeenCalled());

      let returned: Message | null = null;
      await act(async () => {
        returned = await result.current.sendMessage(conversation, '  fala  ');
      });

      expect(msgRepo.create).toHaveBeenCalledWith({
        conversationId: 'c1',
        sender: 'Eu',
        body: 'fala',
        direction: 'sent',
      });
      expect(mqtt.publish).toHaveBeenCalledWith('mensagemmqtt/sala1', {
        clientId: 'meu-client-id',
        sender: 'Eu',
        body: 'fala',
        sentAt: created.createdAt,
      });
      expect(returned).toEqual(created);
    });

    it('deve retornar null e NAO publicar quando o corpo e so espacos (RN09)', async () => {
      // Bug que pega: publicar corpo vazio a partir do hook (RN09).
      const { result } = renderHook(() => useMqtt(settings));
      await waitFor(() => expect(mqtt.connect).toHaveBeenCalled());

      let returned: Message | null = null;
      await act(async () => {
        returned = await result.current.sendMessage(conversation, '    ');
      });

      expect(returned).toBeNull();
      expect(msgRepo.create).not.toHaveBeenCalled();
      expect(mqtt.publish).not.toHaveBeenCalled();
    });
  });

  describe('Assinaturas e limpeza', () => {
    it('deve delegar subscribe/unsubscribe ao MqttService', async () => {
      // Bug que pega: criar/excluir conversa sem (de)assinar o topico na unica conexao.
      const { result } = renderHook(() => useMqtt(settings));

      act(() => {
        result.current.subscribe('novo/topico');
        result.current.unsubscribe('velho/topico');
      });

      expect(mqtt.subscribe).toHaveBeenCalledWith('novo/topico');
      expect(mqtt.unsubscribe).toHaveBeenCalledWith('velho/topico');
    });

    it('deve cancelar a inscricao de status ao desmontar', async () => {
      // Bug que pega: vazar listener de status apos desmontar (cleanup ausente).
      const offStatus = jest.fn();
      mqtt.onStatusChange.mockReturnValue(offStatus);

      const { unmount } = renderHook(() => useMqtt(settings));
      await waitFor(() => expect(mqtt.onStatusChange).toHaveBeenCalled());

      unmount();

      expect(offStatus).toHaveBeenCalledTimes(1);
    });
  });
});
