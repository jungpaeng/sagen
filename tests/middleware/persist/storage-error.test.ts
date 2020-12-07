import persist from '../../../src/middleware/persist';
import { createPersistStore } from './lib';

describe('persist', () => {
  const DEFAULT_VALUE = 100;

  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: () => Error('Error'),
      setItem: () => Error('Error'),
    },
  });

  it('should throw error if storage thrown error', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    try {
      createPersistStore(DEFAULT_VALUE);
      expect(consoleSpy).not.toHaveBeenCalled();
    } catch (err) {
      expect(consoleSpy).toHaveBeenCalled();
    }
  });
});
