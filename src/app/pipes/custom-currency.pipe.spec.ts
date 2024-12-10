import { CustomCurrencyPipe } from './custom-currency.pipe';

describe('CustomCurrencyPipe', () => {
  let pipe: CustomCurrencyPipe;

  beforeEach(() => {
    pipe = new CustomCurrencyPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform a number into a currency string', () => {
    const result = pipe.transform(1234567);
    expect(result).toBe('$1.234.567'); // Verifica el formato esperado en "es-CL"
  });

  it('should handle zero value correctly', () => {
    const result = pipe.transform(0);
    expect(result).toBe('$0'); // Asegúrate de que se maneje correctamente
  });

  it('should handle negative numbers', () => {
    const result = pipe.transform(-1234);
    expect(result).toBe('$-1.234'); // Formato correcto para números negativos
  });

  it('should handle decimal values', () => {
    const result = pipe.transform(1234.56);
    expect(result).toBe('$1.234'); // La función `toLocaleString` redondea automáticamente los decimales
  });
});
