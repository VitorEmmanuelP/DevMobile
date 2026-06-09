import type { ComponentProps } from 'react';
import { Alert } from 'react-native';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { Conversation, CreateConversationInput } from '../types';
import { renderWithWrappers } from '../test/render';

jest.mock('../repositories/conversationRepository', () => ({
  conversationRepository: {
    findAll: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
}));

import { conversationRepository } from '../repositories/conversationRepository';
import { ConversationsScreen } from './ConversationsScreen';

const repo = conversationRepository as jest.Mocked<typeof conversationRepository>;

function makeConversation(overrides: Partial<Conversation> = {}): Conversation {
  return {
    id: 'c1',
    name: 'Sala 1',
    topic: 'mensagemmqtt/sala1',
    createdAt: '2026-06-03T14:22:05.123Z',
    ...overrides,
  };
}

function setup(props: Partial<ComponentProps<typeof ConversationsScreen>> = {}) {
  const base = {
    status: 'connected' as const,
    onOpenChat: jest.fn(),
    onOpenSettings: jest.fn(),
    onSubscribe: jest.fn(),
    onUnsubscribe: jest.fn(),
  };
  const merged = { ...base, ...props };
  renderWithWrappers(<ConversationsScreen {...merged} />);
  return merged;
}

describe('ConversationsScreen', () => {
  describe('Estados de carregamento e vazio', () => {
    it('deve exibir o indicador de carregamento antes de o SQLite responder', () => {
      // Bug que pega: nao mostrar loading enquanto busca conversas (tela "vazia" falsa).
      repo.findAll.mockReturnValue(new Promise(() => {}));
      setup();

      expect(screen.getByTestId('loading')).toBeOnTheScreen();
    });

    it('deve exibir o estado vazio quando nao ha conversas', async () => {
      // Bug que pega: mostrar lista vazia sem o aviso "Nenhuma conversa".
      repo.findAll.mockResolvedValue([]);
      setup();

      expect(await screen.findByText('Nenhuma conversa ainda.')).toBeOnTheScreen();
      expect(screen.queryByTestId('loading')).toBeNull();
    });
  });

  describe('Renderizacao', () => {
    it('deve renderizar a lista de conversas vindas do repositorio', async () => {
      // Bug que pega: nao renderizar os itens retornados pelo findAll.
      repo.findAll.mockResolvedValue([
        makeConversation({ id: 'c1', name: 'Sala 1', topic: 'mensagemmqtt/sala1' }),
        makeConversation({ id: 'c2', name: 'Sala 2', topic: 'mensagemmqtt/sala2' }),
      ]);
      setup();

      expect(await screen.findByText('Sala 1')).toBeOnTheScreen();
      expect(screen.getByText('Sala 2')).toBeOnTheScreen();
      expect(screen.getByText('mensagemmqtt/sala2')).toBeOnTheScreen();
    });
  });

  describe('Acoes do Usuario', () => {
    it('deve abrir o chat com a conversa tocada', async () => {
      // Bug que pega: onOpenChat receber a conversa errada ou nao ser chamado.
      const conversation = makeConversation({ id: 'c9', name: 'Futebol' });
      repo.findAll.mockResolvedValue([conversation]);
      const props = setup();

      fireEvent.press(await screen.findByText('Futebol'));

      expect(props.onOpenChat).toHaveBeenCalledWith(conversation);
    });

    it('deve chamar onOpenSettings ao tocar no botao de ajustes mesmo com status error (RNF07)', async () => {
      // Bug que pega: desabilitar Ajustes quando a conexao falha — o usuario ficaria preso.
      repo.findAll.mockResolvedValue([]);
      const props = setup({ status: 'error' });

      await screen.findByText('Nenhuma conversa ainda.');
      fireEvent.press(screen.getByTestId('button-settings'));

      expect(props.onOpenSettings).toHaveBeenCalledTimes(1);
    });

    it('deve criar a conversa, assinar o topico e adiciona-la ao topo da lista', async () => {
      // Bug que pega: criar conversa sem assinar o topico (nao receberia mensagens).
      repo.findAll.mockResolvedValue([]);
      const created = makeConversation({ id: 'cNew', name: 'Nova', topic: 'mensagemmqtt/nova' });
      repo.create.mockImplementation(async (input: CreateConversationInput) => ({
        ...created,
        name: input.name,
        topic: input.topic,
      }));
      const props = setup();

      await screen.findByText('Nenhuma conversa ainda.');
      fireEvent.press(screen.getByTestId('button-new-conversation'));
      fireEvent.changeText(screen.getByTestId('input-name'), 'Nova');
      fireEvent.changeText(screen.getByTestId('input-topic'), 'mensagemmqtt/nova');
      fireEvent.press(screen.getByTestId('button-create'));

      expect(await screen.findByText('Nova')).toBeOnTheScreen();
      await waitFor(() => expect(props.onSubscribe).toHaveBeenCalledWith('mensagemmqtt/nova'));
      expect(repo.create).toHaveBeenCalledWith({ name: 'Nova', topic: 'mensagemmqtt/nova' });
    });
  });

  describe('Excluir conversa (RF11)', () => {
    it('deve excluir a conversa, fazer unsubscribe e remove-la da lista ao confirmar', async () => {
      // Bug que pega: confirmar exclusao sem chamar delete OU sem fazer unsubscribe do topico.
      const conversation = makeConversation({ id: 'cDel', name: 'Apagar', topic: 'mensagemmqtt/apagar' });
      repo.findAll.mockResolvedValue([conversation]);
      repo.delete.mockResolvedValue(undefined);
      const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
      const props = setup();

      fireEvent(await screen.findByText('Apagar'), 'longPress');

      // Dispara a acao destrutiva exibida no Alert de confirmacao.
      const buttons = alertSpy.mock.calls[0][2]!;
      const destructive = buttons.find((b) => b.style === 'destructive')!;
      await destructive.onPress!();

      await waitFor(() => expect(screen.queryByText('Apagar')).toBeNull());
      expect(repo.delete).toHaveBeenCalledWith('cDel');
      expect(props.onUnsubscribe).toHaveBeenCalledWith('mensagemmqtt/apagar');
    });

    it('NAO deve excluir a conversa ao cancelar a confirmacao', async () => {
      // Bug que pega: excluir mesmo no cancelar (acao destrutiva sem confirmacao real).
      const conversation = makeConversation({ id: 'cKeep', name: 'Manter' });
      repo.findAll.mockResolvedValue([conversation]);
      const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
      const props = setup();

      fireEvent(await screen.findByText('Manter'), 'longPress');

      const buttons = alertSpy.mock.calls[0][2]!;
      const cancel = buttons.find((b) => b.style === 'cancel')!;
      cancel.onPress?.();

      expect(repo.delete).not.toHaveBeenCalled();
      expect(props.onUnsubscribe).not.toHaveBeenCalled();
      expect(screen.getByText('Manter')).toBeOnTheScreen();
    });
  });
});
