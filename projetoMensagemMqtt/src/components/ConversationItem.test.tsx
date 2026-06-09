import { fireEvent, screen } from '@testing-library/react-native';

import { Conversation } from '../types';
import { renderWithWrappers } from '../test/render';
import { ConversationItem } from './ConversationItem';

function makeConversation(overrides: Partial<Conversation> = {}): Conversation {
  return {
    id: 'c1',
    name: 'Sala 1',
    topic: 'mensagemmqtt/sala1',
    createdAt: '2026-06-03T14:22:05.123Z',
    ...overrides,
  };
}

describe('ConversationItem', () => {
  describe('Renderizacao', () => {
    it('deve exibir o nome e o topico da conversa', () => {
      // Bug que pega: deixar de renderizar nome ou topico no item da lista.
      const conversation = makeConversation();
      renderWithWrappers(
        <ConversationItem
          conversation={conversation}
          onPress={jest.fn()}
          onLongPress={jest.fn()}
        />
      );

      expect(screen.getByText('Sala 1')).toBeOnTheScreen();
      expect(screen.getByText('mensagemmqtt/sala1')).toBeOnTheScreen();
    });
  });

  describe('Acoes do Usuario', () => {
    it('deve chamar onPress com a conversa ao tocar no item', () => {
      // Bug que pega: onPress nao receber a conversa (abriria o chat errado).
      const conversation = makeConversation();
      const onPress = jest.fn();
      renderWithWrappers(
        <ConversationItem
          conversation={conversation}
          onPress={onPress}
          onLongPress={jest.fn()}
        />
      );

      fireEvent.press(screen.getByText('Sala 1'));

      expect(onPress).toHaveBeenCalledWith(conversation);
    });

    it('deve chamar onLongPress com a conversa ao tocar e segurar (RF11)', () => {
      // Bug que pega: trocar onLongPress por onPress quebraria a exclusao (RF11).
      const conversation = makeConversation();
      const onLongPress = jest.fn();
      const onPress = jest.fn();
      renderWithWrappers(
        <ConversationItem
          conversation={conversation}
          onPress={onPress}
          onLongPress={onLongPress}
        />
      );

      fireEvent(screen.getByText('Sala 1'), 'longPress');

      expect(onLongPress).toHaveBeenCalledWith(conversation);
      expect(onPress).not.toHaveBeenCalled();
    });
  });
});
