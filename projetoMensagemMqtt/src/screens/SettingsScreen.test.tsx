import type { ComponentProps } from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { DEFAULT_BROKER } from '../config';
import { Settings } from '../types';
import { renderWithWrappers } from '../test/render';

jest.mock('../repositories/settingsRepository', () => ({
  settingsRepository: {
    save: jest.fn(),
  },
}));

import { settingsRepository } from '../repositories/settingsRepository';
import { SettingsScreen } from './SettingsScreen';

const repo = settingsRepository as jest.Mocked<typeof settingsRepository>;

const savedSettings: Settings = {
  nickname: 'Rafael',
  brokerHost: 'broker.hivemq.com',
  brokerPort: 8884,
  useSsl: true,
  clientId: 'a3f1c9e2-7b40-4d11-9c2a-6e5f0b8d1234',
};

function setup(props: Partial<ComponentProps<typeof SettingsScreen>> = {}) {
  const base = {
    settings: null,
    onSaved: jest.fn(),
    onBack: undefined,
  };
  const merged = { ...base, ...props };
  renderWithWrappers(<SettingsScreen {...merged} />);
  return merged;
}

describe('SettingsScreen', () => {
  describe('Regras de Negocio (validacao)', () => {
    it('deve bloquear o salvamento quando o apelido esta vazio', async () => {
      // Bug que pega: salvar sem apelido (o remetente das mensagens ficaria vazio).
      setup();

      fireEvent.changeText(screen.getByTestId('input-nickname'), '   ');
      fireEvent.press(screen.getByTestId('button-save'));

      expect(screen.getByTestId('settings-error')).toHaveTextContent('Informe um apelido.');
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('deve bloquear host com espacos (RN11)', () => {
      // Bug que pega: aceitar host com espaco (URL de broker invalida).
      setup();

      fireEvent.changeText(screen.getByTestId('input-nickname'), 'Rafael');
      fireEvent.changeText(screen.getByTestId('input-host'), 'broker invalido.com');
      fireEvent.press(screen.getByTestId('button-save'));

      expect(screen.getByTestId('settings-error')).toHaveTextContent('O host não pode conter espaços.');
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('deve bloquear host com esquema wss:// (RN11)', () => {
      // Bug que pega: aceitar host com esquema, gerando wss://wss://... ao montar a URL.
      setup();

      fireEvent.changeText(screen.getByTestId('input-nickname'), 'Rafael');
      fireEvent.changeText(screen.getByTestId('input-host'), 'wss://broker.hivemq.com');
      fireEvent.press(screen.getByTestId('button-save'));

      expect(screen.getByTestId('settings-error')).toHaveTextContent(
        'Informe só o domínio ou IP, sem ws://, wss:// ou http://.'
      );
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('deve bloquear porta nao numerica', () => {
      // Bug que pega: aceitar porta invalida (0/NaN) e tentar conectar num endereço quebrado.
      setup();

      fireEvent.changeText(screen.getByTestId('input-nickname'), 'Rafael');
      fireEvent.changeText(screen.getByTestId('input-port'), '0');
      fireEvent.press(screen.getByTestId('button-save'));

      expect(screen.getByTestId('settings-error')).toHaveTextContent('A porta deve ser um número válido.');
      expect(repo.save).not.toHaveBeenCalled();
    });
  });

  describe('Estados de Erro', () => {
    it('deve exibir a mensagem de erro e NAO chamar onSaved quando o repositorio rejeita', async () => {
      // Bug que pega: navegar como se tivesse salvo mesmo apos o save falhar (INVALID_INPUT).
      repo.save.mockRejectedValue(
        Object.assign(new Error('Configuração inválida.'), { code: 'INVALID_INPUT' })
      );
      const props = setup();

      fireEvent.changeText(screen.getByTestId('input-nickname'), 'Rafael');
      fireEvent.press(screen.getByTestId('button-save'));

      await waitFor(() =>
        expect(screen.getByTestId('settings-error')).toHaveTextContent('Configuração inválida.')
      );
      expect(props.onSaved).not.toHaveBeenCalled();
    });
  });

  describe('Acoes do Usuario', () => {
    it('deve salvar com os valores aparados e chamar onSaved com o resultado', async () => {
      // Bug que pega: enviar host/porta errados ao salvar ou nao propagar o settings salvo.
      repo.save.mockResolvedValue(savedSettings);
      const props = setup();

      fireEvent.changeText(screen.getByTestId('input-nickname'), '  Rafael  ');
      fireEvent.changeText(screen.getByTestId('input-host'), '  broker.hivemq.com  ');
      fireEvent.changeText(screen.getByTestId('input-port'), '8884');
      fireEvent.press(screen.getByTestId('button-save'));

      await waitFor(() =>
        expect(repo.save).toHaveBeenCalledWith({
          nickname: 'Rafael',
          brokerHost: 'broker.hivemq.com',
          brokerPort: 8884,
          useSsl: DEFAULT_BROKER.useSsl,
        })
      );
      await waitFor(() => expect(props.onSaved).toHaveBeenCalledWith(savedSettings));
    });

    it('deve oferecer o botao Voltar somente quando onBack e fornecido', () => {
      // Bug que pega: esconder/mostrar Voltar errado (primeira abertura nao tem para onde voltar).
      const { rerender } = renderWithWrappers(
        <SettingsScreen settings={null} onSaved={jest.fn()} />
      );
      expect(screen.queryByTestId('button-back')).toBeNull();

      rerender(<SettingsScreen settings={savedSettings} onSaved={jest.fn()} onBack={jest.fn()} />);
      expect(screen.getByTestId('button-back')).toBeOnTheScreen();
    });
  });
});
