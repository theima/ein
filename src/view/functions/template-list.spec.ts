import { TemplateElement } from '../../html-template/types-and-interfaces/template-element';
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
      attributes: [],
      dynamicAttributes: []
    };
    childOne = {
      name: 'one',
      content: [],
      attributes: [],
      dynamicAttributes: []
    };
    grandchild = {
      name: 'one-one',
      content: [],
      attributes: [],
      dynamicAttributes: []
    };
    childTwo = {
      name: 'two',
      content: [],
      attributes: [],
      dynamicAttributes: []
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
