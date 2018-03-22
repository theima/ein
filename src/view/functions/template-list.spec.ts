import { elementList } from './template-list';
import { ModelToString } from '../types-and-interfaces/model-to-string';

describe('elementList', function() {
  interface Test { name: string; content: Array<Test | ModelToString>; }
  let root: Test;
  let childOne: Test;
  let grandchild: Test;
  let childTwo: Test;
  beforeEach(() => {
    root = {
      name: 'root',
      content: []
    };
    childOne = {
      name: 'one',
      content: []
    };
    grandchild = {
      name: 'one-one',
      content: []
    };
    childTwo = {
      name: 'two',
      content: []
    };
    childOne.content.push(grandchild);
    root.content.push(childOne);
    root.content.push(childTwo);
  });
  it('should create an array with all templates', () => {
    const result = elementList([root]);
    const expected = [
      root, childOne, grandchild, childTwo
    ];
    expect(result).toEqual(expected);
  });
});
