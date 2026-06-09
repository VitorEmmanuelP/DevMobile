export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  background: string; // fundo das telas
  surface: string; // cartões, inputs, itens de lista, bolha recebida
  surfaceMuted: string; // barra de input, botão secundário
  chatBackground: string; // fundo da tela de chat
  primary: string; // verde da marca (header, FAB, botões)
  onPrimary: string; // texto/ícone sobre o primary
  text: string; // texto principal
  textMuted: string; // texto secundário
  textFaint: string; // dicas e placeholders
  border: string; // bordas e divisórias
  bubbleSent: string; // fundo da bolha enviada
  error: string; // mensagens de erro
  backdrop: string; // fundo translúcido do modal
}

export const lightColors: ThemeColors = {
  background: '#f5f5f5',
  surface: '#ffffff',
  surfaceMuted: '#ececec',
  chatBackground: '#ece5dd',
  primary: '#0b6e4f',
  onPrimary: '#ffffff',
  text: '#111111',
  textMuted: '#666666',
  textFaint: '#999999',
  border: '#d8d8d8',
  bubbleSent: '#dcf8c6',
  error: '#c62828',
  backdrop: 'rgba(0,0,0,0.4)',
};

export const darkColors: ThemeColors = {
  background: '#121b22',
  surface: '#1f2c34',
  surfaceMuted: '#1a242b',
  chatBackground: '#0b141a',
  primary: '#0e8a63',
  onPrimary: '#ffffff',
  text: '#e9edef',
  textMuted: '#aeb9bf',
  textFaint: '#8696a0',
  border: '#2a3942',
  bubbleSent: '#005c4b',
  error: '#ef5350',
  backdrop: 'rgba(0,0,0,0.6)',
};

export const themes: Record<ThemeMode, ThemeColors> = {
  light: lightColors,
  dark: darkColors,
};
