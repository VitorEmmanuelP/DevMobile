import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { renderWithWrappers } from '../test/render';
import { NewConversationModal } from './NewConversationModal';

function setup(onCreate: jest.Mock) {
  const onClose = jest.fn();
  renderWithWrappers(
    <NewConversationModal visible onClose={onClose} onCreate={onCreate} />
  );
  return { onClose };
}

describe('NewConversationModal', () => {
  describe('Regras de Negocio (validacao RN08)', () => {
    it('deve bloquear e nao chamar onCreate quando o nome esta vazio', () => {
      // Bug que pega: deixar criar conversa sem nome.
      const onCreate = jest.fn().mockResolvedValue(undefined);
      setup(onCreate);

      fireEvent.changeText(screen.getByTestId('input-topic'), 'mensagemmqtt/sala1');
      fireEvent.press(screen.getByTestId('button-create'));

      expect(screen.getByTestId('modal-error')).toHaveTextContent('Informe um nome para a conversa.');
      expect(onCreate).not.toHaveBeenCalled();
    });

    it('deve bloquear topico vazio (RN08)', () => {
      // Bug que pega: aceitar topico vazio.
      const onCreate = jest.fn().mockResolvedValue(undefined);
      setup(onCreate);

      fireEvent.changeText(screen.getByTestId('input-name'), 'Sala 1');
      fireEvent.press(screen.getByTestId('button-create'));

      expect(screen.getByTestId('modal-error')).toHaveTextContent('Informe um tópico.');
      expect(onCreate).not.toHaveBeenCalled();
    });

    it('deve bloquear topico com espacos (RN08)', () => {
      // Bug que pega: aceitar espaco no topico (MQTT nao permite).
      const onCreate = jest.fn().mockResolvedValue(undefined);
      setup(onCreate);

      fireEvent.changeText(screen.getByTestId('input-name'), 'Sala 1');
      fireEvent.changeText(screen.getByTestId('input-topic'), 'sala com espaco');
      fireEvent.press(screen.getByTestId('button-create'));

      expect(screen.getByTestId('modal-error')).toHaveTextContent('O tópico não pode conter espaços.');
      expect(onCreate).not.toHaveBeenCalled();
    });

    it('deve bloquear topico com curinga # (RN08)', () => {
      // Bug que pega: aceitar curinga # (assinaria varios topicos por engano).
      const onCreate = jest.fn().mockResolvedValue(undefined);
      setup(onCreate);

      fireEvent.changeText(screen.getByTestId('input-name'), 'Sala 1');
      fireEvent.changeText(screen.getByTestId('input-topic'), 'sala/#');
      fireEvent.press(screen.getByTestId('button-create'));

      expect(screen.getByTestId('modal-error')).toHaveTextContent(
        'O tópico não pode conter os curingas # ou +.'
      );
      expect(onCreate).not.toHaveBeenCalled();
    });

    it('deve bloquear topico com curinga + (RN08)', () => {
      // Bug que pega: aceitar curinga + (assinaria um nivel coringa).
      const onCreate = jest.fn().mockResolvedValue(undefined);
      setup(onCreate);

      fireEvent.changeText(screen.getByTestId('input-name'), 'Sala 1');
      fireEvent.changeText(screen.getByTestId('input-topic'), 'sala/+/x');
      fireEvent.press(screen.getByTestId('button-create'));

      expect(screen.getByTestId('modal-error')).toHaveTextContent(
        'O tópico não pode conter os curingas # ou +.'
      );
      expect(onCreate).not.toHaveBeenCalled();
    });
  });

  describe('Estados de Erro', () => {
    it('deve exibir o aviso de topico duplicado e NAO fechar quando onCreate rejeita (TOPIC_ALREADY_EXISTS)', async () => {
      // Bug que pega: engolir o erro de duplicidade ou fechar o modal mesmo apos falha.
      const onCreate = jest
        .fn()
        .mockRejectedValue(
          Object.assign(new Error('Já existe uma conversa com este tópico.'), {
            code: 'TOPIC_ALREADY_EXISTS',
          })
        );
      const { onClose } = setup(onCreate);

      fireEvent.changeText(screen.getByTestId('input-name'), 'Sala 1');
      fireEvent.changeText(screen.getByTestId('input-topic'), 'mensagemmqtt/sala1');
      fireEvent.press(screen.getByTestId('button-create'));

      await waitFor(() =>
        expect(screen.getByTestId('modal-error')).toHaveTextContent(
          'Já existe uma conversa com este tópico.'
        )
      );
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Acoes do Usuario', () => {
    it('deve chamar onCreate com nome e topico aparados e fechar ao criar com sucesso', async () => {
      // Bug que pega: nao aparar (trim) os campos ou nao fechar o modal apos criar.
      const onCreate = jest.fn().mockResolvedValue(undefined);
      const { onClose } = setup(onCreate);

      fireEvent.changeText(screen.getByTestId('input-name'), '  Sala 1  ');
      fireEvent.changeText(screen.getByTestId('input-topic'), '  mensagemmqtt/sala1  ');
      fireEvent.press(screen.getByTestId('button-create'));

      await waitFor(() =>
        expect(onCreate).toHaveBeenCalledWith({
          name: 'Sala 1',
          topic: 'mensagemmqtt/sala1',
        })
      );
      await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    });

    it('deve fechar sem criar ao tocar em Cancelar', () => {
      // Bug que pega: botao Cancelar disparar a criacao em vez de fechar.
      const onCreate = jest.fn().mockResolvedValue(undefined);
      const { onClose } = setup(onCreate);

      fireEvent.press(screen.getByText('Cancelar'));

      expect(onCreate).not.toHaveBeenCalled();
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
