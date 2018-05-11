import { getSubscribableElements } from './get-subscribable-elements';
import { ModelToString } from '../types-and-interfaces/model-to-string';

describe('getSubscribableElements', () => {
  interface Test {
    name: string;
    content: Array<Test | ModelToString>;
  }

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
    const result = getSubscribableElements([root as any]);
    const expected: any = [
      root, childOne, grandchild, childTwo
    ];
    expect(result).toEqual(expected);
  });
});
