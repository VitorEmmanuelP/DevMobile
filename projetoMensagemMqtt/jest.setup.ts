// Os matchers (toBeOnTheScreen, toBeDisabled, ...) já vêm embutidos no
// @testing-library/react-native v13, sem precisar de import de extend-expect.

// Silencia o aviso de act() vindo de efeitos assíncronos das telas e o ruído de
// logs durante os testes, sem esconder erros reais de asserção.
// Reaplicado a cada teste porque a config usa restoreMocks, que restauraria o
// spy depois do primeiro teste.
const originalError = console.error;
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
    const message = args.map((a) => (typeof a === 'string' ? a : '')).join(' ');
    if (message.includes('wrapped in act')) {
      return;
    }
    originalError(...(args as Parameters<typeof console.error>));
  });
});
