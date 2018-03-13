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
      content: [],
      properties: [],
      dynamicProperties: []
    };
    childOne = {
      name: 'one',
      content: [],
      properties: [],
      dynamicProperties: []
    };
    grandchild = {
      name: 'one-one',
      content: [],
      properties: [],
      dynamicProperties: []
    };
    childTwo = {
      name: 'two',
      content: [],
      properties: [],
      dynamicProperties: []
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
