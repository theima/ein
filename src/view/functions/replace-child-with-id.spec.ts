import {TemplateElement} from '../types-and-interfaces/template-element';
import {replaceChildWithId} from './replace-child-with-id';

describe('replaceChildWithId', () => {
  let template: TemplateElement;
  let child: TemplateElement;
  beforeEach(() => {
    template = {
      tag: 'root',
      children: [
        {
          tag: 'div',
          id: 'ss',
          children: [
            {
              tag: 'div',
              id: 'ss1',
              children: [],
              properties: [],
              dynamicProperties: []
            },
            {
              tag: 'div',
              id: 'ss2',
              children: [],
              properties: [],
              dynamicProperties: []
            },
            {
              tag: 'div',
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
          tag: 'div',
          id: 'ff',
          children: [
            {
              tag: 'div',
              id: 'ff1',
              children: [],
              properties: [],
              dynamicProperties: []
            },
            {
              tag: 'div',
              id: 'ff2',
              children: [],
              properties: [],
              dynamicProperties: []
            },
            {
              tag: 'div',
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
      tag: 'span',
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
      tag: 'span',
      id: 'ss2000',
      children: [],
      properties: [],
      dynamicProperties: []
    });
    expect(result).toBe(template);
  });
});
