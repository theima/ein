import { TemplateElement } from '../types-and-interfaces/template-element';
import { elementList } from './template-list';

describe('elementList', function() {
  let root: TemplateElement;
  let childOne: TemplateElement;
  let grandchild: TemplateElement;
  let childTwo: TemplateElement;
  beforeEach(() => {
    root = {
      name: 'root',
      children: [],
      properties: [],
      dynamicProperties: []
    };
    childOne = {
      name: 'one',
      children: [],
      properties: [],
      dynamicProperties: []
    };
    grandchild = {
      name: 'one-one',
      children: [],
      properties: [],
      dynamicProperties: []
    };
    childTwo = {
      name: 'two',
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
