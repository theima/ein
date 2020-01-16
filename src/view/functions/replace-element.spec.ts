import { Element } from '../types-and-interfaces/elements/element';
import { replaceElement } from './replace-element';

describe('replaceElement', () => {
  let template: Element;
  let newChild: Element;
  beforeEach(() => {
    template = {
      name: 'root',
      id:'',
      properties: [],
      content: [
        {
          name: 'div',
          id:'',
          content: [
            {
              name: 'div',
              id:'',
              content: [],
              properties: []
            },
            {
              name: 'div',
              id:'',
              content: [],
              properties: []
            },
            {
              name: 'div',
              id:'',
              content: [],
              properties: []
            }
          ],
          properties: []
        },
        {
          name: 'div',
          id:'',
          content: [
            {
              name: 'div',
              id:'',
              content: [],
              properties: []
            },
            {
              name: 'div',
              id:'',
              content: [],
              properties: []
            },
            {
              name: 'div',
              id:'',
              content: [],
              properties: []
            }
          ],
          properties: []
        }
      ] as any
    };
    newChild = {
      name: 'span',
      id:'',
      content: [],
      properties: []
    };
  });

  it('should replace correct child', () => {
    const result = replaceElement(template.content, (template as any).content[0].content[1], newChild);
    let expected = template.content.concat();
    (expected[0] as Element).content[1] = newChild;
    expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
  });

  it('should create a new object for all templates effected', () => {
    const result = replaceElement(template.content, (template as any).content[0].content[1], newChild);
    let resultFirst: Element = result[0] as any;
    let templateFirst: Element = template.content[0] as any;
    expect(result).not.toBe(template.content);
    expect(resultFirst).not.toBe(templateFirst);
    expect(resultFirst.content[1]).not.toBe(templateFirst.content[1]);

    expect(resultFirst.content[0]).toBe(templateFirst.content[0]);
    expect(result[1]).toBe(template.content[1]);

  });

  it('should return same object if child doesn\'t exist', () => {
    const result = replaceElement(template.content, {
      name: 'span',
      id:'',
      content:[],
      properties: []
    }, newChild);
    expect(result).toBe(template.content);
  });
});
