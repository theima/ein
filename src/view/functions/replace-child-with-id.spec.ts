import { TemplateElement } from '../types-and-interfaces/template-element';
import { replaceChildWithId } from './replace-child-with-id';

describe('replaceChildWithId', () => {
  let template: TemplateElement;
  let child: TemplateElement;
  beforeEach(() => {
    template = {
      name: 'root',
      children: [
        {
          name: 'div',
          id: 'ss',
          children: [
            {
              name: 'div',
              id: 'ss1',
              children: [],
              properties: [],
              dynamicProperties: []
            },
            {
              name: 'div',
              id: 'ss2',
              children: [],
              properties: [],
              dynamicProperties: []
            },
            {
              name: 'div',
              id: 'ss3',
              children: [],
              properties: [],
              dynamicProperties: []
            }
          ],
          properties: [],
          dynamicProperties: []
        },
        {
          name: 'div',
          id: 'ff',
          children: [
            {
              name: 'div',
              id: 'ff1',
              children: [],
              properties: [],
              dynamicProperties: []
            },
            {
              name: 'div',
              id: 'ff2',
              children: [],
              properties: [],
              dynamicProperties: []
            },
            {
              name: 'div',
              id: 'ff3',
              children: [],
              properties: [],
              dynamicProperties: []
            }
          ],
          properties: [],
          dynamicProperties: []
        }
      ],
      properties: [],
      dynamicProperties: []
    };
    child = {
      name: 'span',
      id: 'ss2',
      children: [],
      properties: [],
      dynamicProperties: []
    };
  });

  it('should replace correct child', () => {
    const result = replaceChildWithId(template, child);
    let expected = {...template};
    (expected.children[0] as TemplateElement).children[1] = child;
    expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
  });

  it('should create a new object for all templates effected', () => {
    const result = replaceChildWithId(template, child);
    let resultFirst: TemplateElement = result.children[0] as TemplateElement;
    let templateFirst: TemplateElement = template.children[0] as TemplateElement;
    expect(result).not.toBe(template);
    expect(resultFirst).not.toBe(templateFirst);
    expect(resultFirst.children[1]).not.toBe(templateFirst.children[1]);

    expect(resultFirst.children[0]).toBe(templateFirst.children[0]);
    expect(result.children[1]).toBe(template.children[1]);

  });

  it('should return same object if child doesn\'t exist', () => {
    const result = replaceChildWithId(template, {
      name: 'span',
      id: 'ss2000',
      children: [],
      properties: [],
      dynamicProperties: []
    });
    expect(result).toBe(template);
  });
});
