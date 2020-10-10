/* eslint-disable */
import { give } from './give';
describe('Give', () => {
  let model: any;
  beforeEach(() => {
    model = {
      a: {
        b: {
          c: {
            d : ''
          },
          cc: 'vv'
        },
        bb: 's'
      },
      aa: 'aa'
    };
  });
  it('should replace model with one property', () => {
    const newData: any = {test: 'test'};
    const expected = {
      a: newData,
      aa: 'aa'
    };
    expect(give(model, newData, 'a')).toEqual(expected);
  });

  it('should return new object for one property', () => {
    const newData: any = {test: 'test'};
    const result = give(model, newData, 'a');
    expect(result).not.toBe(model);
    expect(result.a).not.toBe(model.a);
    expect(result.aa).toBe(model.aa);
  });

  it('should replace model with two properties', () => {
    const newData: any = {test: 'test'};
    const expected = {
      a: {
        b: newData,
        bb: 's'
      },
      aa: 'aa'
    };
    const result = give(model, newData, 'a', 'b');
    expect(result).toEqual(expected);
  });

  it('should return new object for two properties', () => {
    const newData: any = {test: 'test'};
    const result = give(model, newData, 'a', 'b');
    expect(result).not.toBe(model);
    expect(result.a).not.toBe(model.a);
    expect(result.aa).toBe(model.aa);
    expect(result.a.b).not.toBe(model.a.b);
    expect(result.a.bb).toBe(model.a.bb);
  });

  it('should replace model with three properties', () => {
    const newData: any = {test: 'test'};
    const expected = {
      a: {
        b: {
          c: newData,
          cc: 'vv'
        },
        bb: 's'
      },
      aa: 'aa'
    };
    expect(give(model, newData, 'a', 'b', 'c')).toEqual(expected);
  });

  it('should return new object for three properties', () => {
    const newData: any = {test: 'test'};
    const result = give(model, newData, 'a', 'b', 'c');
    expect(result).not.toBe(model);
    expect(result).not.toBe(model);
    expect(result.a).not.toBe(model.a);
    expect(result.aa).toBe(model.aa);
    expect(result.a.b).not.toBe(model.a.b);
    expect(result.a.bb).toBe(model.a.bb);
    expect(result.a.b.c).not.toBe(model.a.b.c);
    expect(result.a.b.cc).toBe(model.a.b.cc);

  });
});
