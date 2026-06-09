import { screen } from '@testing-library/react-native';

import { ConnectionStatus } from '../types';
import { renderWithWrappers } from '../test/render';
import { StatusIndicator } from './StatusIndicator';

const LABELS: Record<ConnectionStatus, string> = {
  connected: 'Conectado',
  connecting: 'Conectando…',
  disconnected: 'Desconectado',
  error: 'Erro de conexão',
};

describe('StatusIndicator', () => {
  describe('Renderizacao', () => {
    it.each(Object.keys(LABELS) as ConnectionStatus[])(
      'deve exibir o rotulo correto para o status "%s"',
      (status) => {
        // Bug que pega: trocar o rótulo de um status ou apagar uma entrada do mapa META.
        renderWithWrappers(<StatusIndicator status={status} />);

        expect(screen.getByText(LABELS[status])).toBeOnTheScreen();
      }
    );

    it('deve expor o status via accessibilityLabel para leitores de tela', () => {
      // Bug que pega: remover o accessibilityLabel ou montar o texto errado.
      renderWithWrappers(<StatusIndicator status="connected" />);

      expect(screen.getByLabelText('Status: Conectado')).toBeOnTheScreen();
    });

    it('deve usar a mesma cor vermelha para os estados de falha (disconnected e error)', () => {
      // Bug que pega: regressao na cor de erro (RNF07 exige indicador vermelho de falha).
      const disconnected = renderWithWrappers(
        <StatusIndicator status="disconnected" />
      );
      const disconnectedColor = disconnected.getByText('Desconectado').props.style;

      const error = renderWithWrappers(<StatusIndicator status="error" />);
      const errorColor = error.getByText('Erro de conexão').props.style;

      expect(disconnectedColor).toEqual(errorColor);
    });
  });
});
