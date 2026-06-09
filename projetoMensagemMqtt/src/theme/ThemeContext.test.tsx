import { act, renderHook } from '@testing-library/react-native';

import { ThemeProvider, useTheme } from './ThemeContext';
import { darkColors, lightColors } from './theme';

describe('ThemeProvider / useTheme', () => {
  it('deve iniciar no tema claro', () => {
    // Bug que pega: tema padrão errado (app deveria abrir em claro).
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });

    expect(result.current.mode).toBe('light');
    expect(result.current.colors).toEqual(lightColors);
  });

  it('deve alternar claro <-> escuro a cada toggleTheme', () => {
    // Bug que pega: toggle que não inverte o tema ou não troca a paleta de cores.
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });

    act(() => result.current.toggleTheme());
    expect(result.current.mode).toBe('dark');
    expect(result.current.colors).toEqual(darkColors);

    act(() => result.current.toggleTheme());
    expect(result.current.mode).toBe('light');
    expect(result.current.colors).toEqual(lightColors);
  });
});
