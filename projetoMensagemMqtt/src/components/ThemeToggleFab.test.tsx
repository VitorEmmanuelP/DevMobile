import { fireEvent, screen } from '@testing-library/react-native';

import { renderWithWrappers } from '../test/render';
import { ThemeToggleFab } from './ThemeToggleFab';

describe('ThemeToggleFab', () => {
  it('deve oferecer ativar o modo escuro quando o tema atual e o claro', () => {
    // Bug que pega: rótulo/ícone que não refletem o tema atual (acessibilidade enganosa).
    renderWithWrappers(<ThemeToggleFab />);

    expect(screen.getByLabelText('Ativar modo escuro')).toBeOnTheScreen();
    expect(screen.getByText('🌙')).toBeOnTheScreen();
  });

  it('deve alternar para o modo claro ao ser pressionado', () => {
    // Bug que pega: o FAB não disparar a troca de tema (objetivo principal do botão).
    renderWithWrappers(<ThemeToggleFab />);

    fireEvent.press(screen.getByLabelText('Ativar modo escuro'));

    expect(screen.getByLabelText('Ativar modo claro')).toBeOnTheScreen();
    expect(screen.getByText('☀️')).toBeOnTheScreen();
  });
});
