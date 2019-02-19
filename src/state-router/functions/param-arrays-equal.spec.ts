import { paramArraysEqual } from './param-arrays-equal';

describe('paramArraysEqual', () => {
  it('Should match equal arrays', () => {
    expect(paramArraysEqual(
      ['a', 'b', 'c'],
      ['a', 'b', 'c']
      )
    ).toBeTruthy();
  });

  it('Should match arrays the same elements', () => {
    expect(paramArraysEqual(
      ['a', 'b', 'c'],
      ['b', 'c', 'a']
      )
    ).toBeTruthy();
  });

  it('Should not match arrays with different elements', () => {
    expect(paramArraysEqual(
      ['a', 'a', 'c'],
      ['b', 'c', 'a']
      )
    ).toBeFalsy();
  });
});
