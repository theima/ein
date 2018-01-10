import {TemplateElement} from '../template-element';
import {flatten} from './flatten';

describe('flatten', function () {
  let root: TemplateElement;
  let childOne: TemplateElement;
  let grandchild: TemplateElement;
  let childTwo: TemplateElement;
  beforeEach(() => {
    root = {
      tag: 'root',
      children: []
    };
    childOne = {
      tag: 'one',
      children: []
    };
    grandchild = {
      tag: 'one-one',
      children: []
    };
    childTwo = {
      tag: 'two',
      children: []
    };
    childOne.children.push(grandchild);
    root.children.push(childOne);
    root.children.push(childTwo);
  });
  it('should create an array with all templates', () => {
    const result = flatten([root]);
    const expected = [
      root, childOne, grandchild, childTwo
    ];
    expect(result).toEqual(expected);
  });
});
