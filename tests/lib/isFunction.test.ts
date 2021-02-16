import { isFunction } from '../../src/lib';

describe('isFunction', () => {
  it('return true if argument is function', () => {
    const isFunc = isFunction(() => 3);
    expect(isFunc).toBe(true);
  });

  it('return false if argument is number', () => {
    const isFunc = isFunction(3);
    expect(isFunc).toBe(false);
  });
});
