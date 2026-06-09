import type { ComponentProps } from 'react';
import { Alert } from 'react-native';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { Conversation, Message } from '../types';
import { renderWithWrappers } from '../test/render';

jest.mock('../repositories/messageRepository', () => ({
  messageRepository: {
    findByConversation: jest.fn(),
    deleteByConversation: jest.fn(),
  },
}));

import { messageRepository } from '../repositories/messageRepository';
import { ChatScreen } from './ChatScreen';

const repo = messageRepository as jest.Mocked<typeof messageRepository>;

const conversation: Conversation = {
  id: 'c1',
  name: 'Sala 1',
  topic: 'mensagemmqtt/sala1',
  createdAt: '2026-06-03T14:22:05.123Z',
};

function makeMessage(overrides: Partial<Message> = {}): Message {
  return {
    id: 'm1',
    conversationId: 'c1',
    sender: 'Rafael',
    body: 'Olá',
    direction: 'received',
    createdAt: '2026-06-03T14:22:05.123Z',
    ...overrides,
  };
}

function setup(props: Partial<ComponentProps<typeof ChatScreen>> = {}) {
  const base = {
    conversation,
    lastIncoming: null,
    onBack: jest.fn(),
    sendMessage: jest.fn().mockResolvedValue(null),
  };
  const merged = { ...base, ...props };
  const view = renderWithWrappers(<ChatScreen {...merged} />);
  return { ...merged, view };
}

describe('ChatScreen', () => {
  describe('Renderizacao', () => {
    it('deve carregar e exibir o historico da conversa vindo do repositorio', async () => {
      // Bug que pega: nao carregar o historico (RF: histórico persiste e aparece).
      repo.findByConversation.mockResolvedValue([
        makeMessage({ id: 'm1', body: 'Mensagem antiga', direction: 'received', sender: 'Bruna' }),
      ]);
      setup();

      expect(await screen.findByText('Mensagem antiga')).toBeOnTheScreen();
      expect(repo.findByConversation).toHaveBeenCalledWith('c1');
    });

    it('deve adicionar a mensagem recebida (lastIncoming) da propria conversa', async () => {
      // Bug que pega: ignorar lastIncoming ou nao filtrar por conversationId.
      repo.findByConversation.mockResolvedValue([
        makeMessage({ id: 'hist1', body: 'Mensagem do historico' }),
      ]);
      const incoming = makeMessage({ id: 'in1', body: 'Chegou agora', conversationId: 'c1' });
      const { view } = setup({ lastIncoming: null });

      // Espera o historico carregar antes de simular a chegada, evitando que o
      // setMessages do carregamento sobrescreva a mensagem recebida.
      await screen.findByText('Mensagem do historico');

      view.rerender(
        <ChatScreen
          conversation={conversation}
          lastIncoming={incoming}
          onBack={jest.fn()}
          sendMessage={jest.fn().mockResolvedValue(null)}
        />
      );

      expect(await screen.findByText('Chegou agora')).toBeOnTheScreen();
      // E mantem o historico ja carregado (apenas acrescenta).
      expect(screen.getByText('Mensagem do historico')).toBeOnTheScreen();
    });

    it('NAO deve adicionar lastIncoming de outra conversa', async () => {
      // Bug que pega: vazar mensagem de outra conversa para o chat aberto.
      repo.findByConversation.mockResolvedValue([
        makeMessage({ id: 'hist1', body: 'Mensagem do historico' }),
      ]);
      const incomingOther = makeMessage({ id: 'in2', body: 'De outra sala', conversationId: 'OUTRA' });
      const { view } = setup();

      await screen.findByText('Mensagem do historico');

      view.rerender(
        <ChatScreen
          conversation={conversation}
          lastIncoming={incomingOther}
          onBack={jest.fn()}
          sendMessage={jest.fn().mockResolvedValue(null)}
        />
      );

      expect(screen.queryByText('De outra sala')).toBeNull();
      expect(screen.getByText('Mensagem do historico')).toBeOnTheScreen();
    });
  });

  describe('Regras de Negocio (envio)', () => {
    it('deve enviar a mensagem, exibi-la na lista e limpar o campo', async () => {
      // Bug que pega: nao refletir a mensagem enviada ou nao limpar o draft.
      repo.findByConversation.mockResolvedValue([]);
      const sent = makeMessage({ id: 's1', body: 'Oi pessoal', direction: 'sent', sender: 'Eu' });
      const sendMessage = jest.fn().mockResolvedValue(sent);
      setup({ sendMessage });

      const input = screen.getByTestId('input-message');
      fireEvent.changeText(input, 'Oi pessoal');
      fireEvent.press(screen.getByTestId('button-send'));

      expect(await screen.findByText('Oi pessoal')).toBeOnTheScreen();
      expect(sendMessage).toHaveBeenCalledWith(conversation, 'Oi pessoal');
      await waitFor(() => expect(screen.getByTestId('input-message').props.value).toBe(''));
    });

    it('NAO deve enviar quando o corpo esta vazio ou so com espacos (RN09)', async () => {
      // Bug que pega: publicar mensagem vazia/em branco (RN09).
      repo.findByConversation.mockResolvedValue([]);
      const sendMessage = jest.fn().mockResolvedValue(null);
      setup({ sendMessage });

      fireEvent.changeText(screen.getByTestId('input-message'), '   ');
      fireEvent.press(screen.getByTestId('button-send'));

      await waitFor(() => expect(repo.findByConversation).toHaveBeenCalled());
      expect(sendMessage).not.toHaveBeenCalled();
    });
  });

  describe('Acoes do Usuario', () => {
    it('deve chamar onBack ao tocar em Voltar', async () => {
      // Bug que pega: botao Voltar nao retornar para a lista de conversas.
      repo.findByConversation.mockResolvedValue([]);
      const onBack = jest.fn();
      setup({ onBack });

      fireEvent.press(screen.getByTestId('button-back'));

      expect(onBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Limpar historico (v1.1 - RN10)', () => {
    it('deve esvaziar a lista de mensagens ao confirmar a limpeza', async () => {
      // Bug que pega: confirmar limpeza sem apagar (mensagens continuariam na tela).
      repo.findByConversation.mockResolvedValue([
        makeMessage({ id: 'm1', body: 'Vai sumir' }),
      ]);
      repo.deleteByConversation.mockResolvedValue(undefined);
      const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
      setup();

      await screen.findByText('Vai sumir');
      fireEvent.press(screen.getByTestId('button-clear-history'));

      const destructive = alertSpy.mock.calls[0][2]!.find((b) => b.style === 'destructive')!;
      await destructive.onPress!();

      await waitFor(() => expect(screen.queryByText('Vai sumir')).toBeNull());
      expect(repo.deleteByConversation).toHaveBeenCalledWith('c1');
    });

    it('NAO deve apagar as mensagens ao cancelar a limpeza', async () => {
      // Bug que pega: limpar mesmo no cancelar.
      repo.findByConversation.mockResolvedValue([
        makeMessage({ id: 'm1', body: 'Continua aqui' }),
      ]);
      const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
      setup();

      await screen.findByText('Continua aqui');
      fireEvent.press(screen.getByTestId('button-clear-history'));

      const cancel = alertSpy.mock.calls[0][2]!.find((b) => b.style === 'cancel')!;
      cancel.onPress?.();

      expect(repo.deleteByConversation).not.toHaveBeenCalled();
      expect(screen.getByText('Continua aqui')).toBeOnTheScreen();
    });

    it('deve manter a conversa utilizavel apos limpar, aceitando nova mensagem', async () => {
      // Bug que pega: limpar quebrar o envio (RN10: conversa preservada e funcional).
      repo.findByConversation.mockResolvedValue([makeMessage({ id: 'm1', body: 'Antiga' })]);
      repo.deleteByConversation.mockResolvedValue(undefined);
      const sent = makeMessage({ id: 's1', body: 'Nova mensagem', direction: 'sent', sender: 'Eu' });
      const sendMessage = jest.fn().mockResolvedValue(sent);
      const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
      setup({ sendMessage });

      await screen.findByText('Antiga');
      fireEvent.press(screen.getByTestId('button-clear-history'));
      const destructive = alertSpy.mock.calls[0][2]!.find((b) => b.style === 'destructive')!;
      await destructive.onPress!();
      await waitFor(() => expect(screen.queryByText('Antiga')).toBeNull());

      fireEvent.changeText(screen.getByTestId('input-message'), 'Nova mensagem');
      fireEvent.press(screen.getByTestId('button-send'));

      expect(await screen.findByText('Nova mensagem')).toBeOnTheScreen();
      expect(sendMessage).toHaveBeenCalledWith(conversation, 'Nova mensagem');
    });
  });
});
