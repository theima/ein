import { replaceChild } from './replace-child';
import { RenderInfo } from '../types-and-interfaces/render-info';

describe('replaceChild', () => {
  let template: RenderInfo;
  let child: RenderInfo;
  beforeEach(() => {
    template = {
      name: 'root',
      properties: [],
      content: [
        {
          name: 'div',
          id: 'ss',
          content: [
            {
              name: 'div',
              id: 'ss1',
              content: [],
              properties: []
            },
            {
              name: 'div',
              id: 'ss2',
              content: [],
              properties: []
            },
            {
              name: 'div',
              id: 'ss3',
              content: [],
              properties: []
            }
          ],
          properties: []
        },
        {
          name: 'div',
          id: 'ff',
          content: [
            {
              name: 'div',
              id: 'ff1',
              content: [],
              properties: []
            },
            {
              name: 'div',
              id: 'ff2',
              content: [],
              properties: []
            },
            {
              name: 'div',
              id: 'ff3',
              content: [],
              properties: []
            }
          ],
          properties: []
        }
      ]
    };
    child = {
      name: 'span',
      id: 'ss2',
      content: [],
      properties: []
    };
  });

  it('should replace correct child', () => {
    const result = replaceChild(template, child);
    let expected = {...template};
    (expected.content[0] as RenderInfo).content[1] = child;
    expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
  });

  it('should create a new object for all templates effected', () => {
    const result = replaceChild(template, child);
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
      id: 'ss2000',
      content: [],
      properties: []
    });
    expect(result).toBe(template);
  });
});
