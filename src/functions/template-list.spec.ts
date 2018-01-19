import {TemplateElement} from '../types-and-interfaces/template-element';
import {templateList} from './template-list';

describe('templateList', function () {
  let root: TemplateElement;
  let childOne: TemplateElement;
  let grandchild: TemplateElement;
  let childTwo: TemplateElement;
  beforeEach(() => {
    root = {
      tag: 'root',
      children: [],
      attributes: [],
      dynamicAttributes: []
    };
    childOne = {
      tag: 'one',
      children: [],
      attributes: [],
      dynamicAttributes: []
    };
    grandchild = {
      tag: 'one-one',
      children: [],
      attributes: [],
      dynamicAttributes: []
    };
    childTwo = {
      tag: 'two',
      children: [],
      attributes: [],
      dynamicAttributes: []
    };
    childOne.children.push(grandchild);
    root.children.push(childOne);
    root.children.push(childTwo);
  });
  it('should create an array with all templates', () => {
    const result = templateList([root]);
    const expected = [
      root, childOne, grandchild, childTwo
    ];
    expect(result).toEqual(expected);
  });
});
