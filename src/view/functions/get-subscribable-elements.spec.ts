import { ModelToString } from '../../core/types-and-interfaces/model-to-string';
import { getSubscribableElements } from './get-subscribable-elements';

describe('getSubscribableElements', () => {
  interface Test {
    name: string;
    content: Array<Test | ModelToString>;
    properties: any[];
  }

  let root: Test;
  let childOne: Test;
  let grandchild: Test;
  let childTwo: Test;
  beforeEach(() => {
    root = {
      name: 'root',
      content: [],
      properties: []
    };
    childOne = {
      name: 'one',
      content: [],
      properties: []
    };
    grandchild = {
      name: 'one-one',
      content: [],
      properties: []
    };
    childTwo = {
      name: 'two',
      content: [],
      properties: []
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
