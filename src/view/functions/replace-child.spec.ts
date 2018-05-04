import { replaceChild } from './replace-child';
import { RenderInfo } from '../types-and-interfaces/render-info';

describe('replaceChild', () => {
  let template: RenderInfo;
  let newChild: RenderInfo;
  beforeEach(() => {
    template = {
      name: 'root',
      properties: [],
      content: [
        {
          name: 'div',
          content: [
            {
              name: 'div',
              content: [],
              properties: []
            },
            {
              name: 'div',
              content: [],
              properties: []
            },
            {
              name: 'div',
              content: [],
              properties: []
            }
          ],
          properties: []
        },
        {
          name: 'div',
          content: [
            {
              name: 'div',
              content: [],
              properties: []
            },
            {
              name: 'div',
              content: [],
              properties: []
            },
            {
              name: 'div',
              content: [],
              properties: []
            }
          ],
          properties: []
        }
      ]
    };
    newChild = {
      name: 'span',
      content: [],
      properties: []
    };
  });

  it('should replace correct child', () => {
    const result = replaceChild(template, (template as any).content[0].content[1], newChild);
    let expected = {...template};
    (expected.content[0] as RenderInfo).content[1] = newChild;
    expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
  });

  it('should create a new object for all templates effected', () => {
    const result = replaceChild(template, (template as any).content[0].content[1], newChild);
    let resultFirst: RenderInfo = result.content[0] as any;
    let templateFirst: RenderInfo = template.content[0] as any;
    expect(result).not.toBe(template);
    expect(resultFirst).not.toBe(templateFirst);
    expect(resultFirst.content[1]).not.toBe(templateFirst.content[1]);

    expect(resultFirst.content[0]).toBe(templateFirst.content[0]);
    expect(result.content[1]).toBe(template.content[1]);

  });

  it('should return same object if child doesn\'t exist', () => {
    const result = replaceChild(template, {
      name: 'span',
      content: [],
      properties: []
    }, newChild);
    expect(result).toBe(template);
  });
});
