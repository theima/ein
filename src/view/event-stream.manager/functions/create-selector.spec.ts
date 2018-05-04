import { Selector } from '../interfaces/selector';
import { createSelector } from './create-selector';

describe('createSelector', () => {
  it('should create for element', () => {
    const selectString = 'element';
    const expected: Selector = {
      name: 'element',
      id: null,
      classes: []
    };
    expect(createSelector(selectString)).toEqual(expected);
  });
  it('should create for id', () => {
    const selectString = '#theid';
    const expected: Selector = {
      name: null,
      id: 'theid',
      classes: []
    };
    expect(createSelector(selectString)).toEqual(expected);
  });
  it('should create for class', () => {
    const selectString = '.class';
    const expected: Selector = {
      name: null,
      id: null,
      classes: ['class']
    };
    expect(createSelector(selectString)).toEqual(expected);
  });
  it('should create for classes', () => {
    const selectString = '.class.class2';
    const expected: Selector = {
      name: null,
      id: null,
      classes: ['class', 'class2']
    };
    expect(createSelector(selectString)).toEqual(expected);
  });
  it('should create for element and classes', () => {
    const selectString = 'el.class.class2';
    const expected: Selector = {
      name: 'el',
      id: null,
      classes: ['class', 'class2']
    };
    expect(createSelector(selectString)).toEqual(expected);
  });
  it('should create for element, id and classes', () => {
    const selectString = 'el#jdj.class.class2';
    const expected: Selector = {
      name: 'el',
      id: 'jdj',
      classes: ['class', 'class2']
    };
    expect(createSelector(selectString)).toEqual(expected);
  });
  it('should create for element, id and classes, should ignore extra ids', () => {
    const selectString = 'el#jdj.class.class2#other';
    const expected: Selector = {
      name: 'el',
      id: 'jdj',
      classes: ['class', 'class2']
    };
    expect(createSelector(selectString)).toEqual(expected);
  });
});
