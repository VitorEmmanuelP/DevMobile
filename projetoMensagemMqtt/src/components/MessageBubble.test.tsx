import { screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { Message } from '../types';
import { renderWithWrappers } from '../test/render';
import { MessageBubble } from './MessageBubble';

function makeMessage(overrides: Partial<Message> = {}): Message {
  return {
    id: 'm1',
    conversationId: 'c1',
    sender: 'Rafael',
    body: 'Alguém viu o jogo ontem?',
    direction: 'received',
    createdAt: '2026-06-03T14:22:05.123Z',
    ...overrides,
  };
}

describe('MessageBubble', () => {
  describe('Renderizacao', () => {
    it('deve alinhar a direita quando a mensagem e enviada (sent)', () => {
      // Bug que pega: trocar o alinhamento de 'sent' (deve ficar a direita do chat).
      const message = makeMessage({ direction: 'sent', body: 'Vi sim!' });
      renderWithWrappers(<MessageBubble message={message} />);

      const bubble = screen.getByTestId('message-bubble');
      const flat = StyleSheet.flatten(bubble.props.style);

      expect(flat.alignSelf).toBe('flex-end');
      expect(screen.getByText('Vi sim!')).toBeOnTheScreen();
    });

    it('deve alinhar a esquerda quando a mensagem e recebida (received)', () => {
      // Bug que pega: trocar o alinhamento de 'received' (deve ficar a esquerda).
      const message = makeMessage({ direction: 'received' });
      renderWithWrappers(<MessageBubble message={message} />);

      const bubble = screen.getByTestId('message-bubble');
      const flat = StyleSheet.flatten(bubble.props.style);

      expect(flat.alignSelf).toBe('flex-start');
    });

    it('deve mostrar o apelido do remetente quando a mensagem e recebida', () => {
      // Bug que pega: deixar de exibir o sender em mensagens recebidas.
      const message = makeMessage({ direction: 'received', sender: 'Bruna' });
      renderWithWrappers(<MessageBubble message={message} />);

      expect(screen.getByText('Bruna')).toBeOnTheScreen();
    });

    it('NAO deve mostrar o apelido do remetente quando a mensagem e enviada', () => {
      // Bug que pega: vazar o sender na própria mensagem (so o corpo deve aparecer).
      const message = makeMessage({ direction: 'sent', sender: 'EuMesmo', body: 'Oi' });
      renderWithWrappers(<MessageBubble message={message} />);

      expect(screen.queryByText('EuMesmo')).toBeNull();
      expect(screen.getByText('Oi')).toBeOnTheScreen();
    });
  });
});
