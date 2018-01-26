import {TemplateElement} from '../types-and-interfaces/template-element';
import {elementList} from './template-list';

describe('elementList', function () {
  let root: TemplateElement;
  let childOne: TemplateElement;
  let grandchild: TemplateElement;
  let childTwo: TemplateElement;
  beforeEach(() => {
    root = {
      tag: 'root',
      children: [],
      properties: [],
      dynamicProperties: []
    };
    childOne = {
      tag: 'one',
      children: [],
      properties: [],
      dynamicProperties: []
    };
    grandchild = {
      tag: 'one-one',
      children: [],
      properties: [],
      dynamicProperties: []
    };
    childTwo = {
      tag: 'two',
      children: [],
      properties: [],
      dynamicProperties: []
    };
    childOne.children.push(grandchild);
    root.children.push(childOne);
    root.children.push(childTwo);
  });
  it('should create an array with all templates', () => {
    const result = elementList([root]);
    const expected = [
      root, childOne, grandchild, childTwo
    ];
    expect(result).toEqual(expected);
  });
});
