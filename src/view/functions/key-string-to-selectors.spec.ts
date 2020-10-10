import { keyStringToSelectors } from './key-string-to-selectors';

describe('keyStringToSelectors', () => {
  it('should return array of strings, excluding root.', () => {
    const root = 'abc';
    const parts = [root, 'one', 'two', 'three'];
    const selector = parts.join('.');
    const expected: string[] = ['one', 'two', 'three'];
    expect(keyStringToSelectors(selector, root)).toEqual(expected);
  });
});
