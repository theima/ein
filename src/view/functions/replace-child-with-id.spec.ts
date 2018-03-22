import { TemplateElement } from '../../html-template/types-and-interfaces/template-element';
import { replaceContentItemWithId } from './replace-child-with-id';

describe('replaceContentItemWithId', () => {
  let template: TemplateElement;
  let child: TemplateElement;
  beforeEach(() => {
    template = {
      name: 'root',
      content: [
        {
          name: 'div',
          id: 'ss',
          content: [
            {
              name: 'div',
              id: 'ss1',
              content: [],
              attributes: [],
              dynamicAttributes: []
            },
            {
              name: 'div',
              id: 'ss2',
              content: [],
              attributes: [],
              dynamicAttributes: []
            },
            {
              name: 'div',
              id: 'ss3',
              content: [],
              attributes: [],
              dynamicAttributes: []
            }
          ],
          attributes: [],
          dynamicAttributes: []
        },
        {
          name: 'div',
          id: 'ff',
          content: [
            {
              name: 'div',
              id: 'ff1',
              content: [],
              attributes: [],
              dynamicAttributes: []
            },
            {
              name: 'div',
              id: 'ff2',
              content: [],
              attributes: [],
              dynamicAttributes: []
            },
            {
              name: 'div',
              id: 'ff3',
              content: [],
              attributes: [],
              dynamicAttributes: []
            }
          ],
          attributes: [],
          dynamicAttributes: []
        }
      ],
      attributes: [],
      dynamicAttributes: []
    };
    child = {
      name: 'span',
      id: 'ss2',
      content: [],
      attributes: [],
      dynamicAttributes: []
    };
  });

  it('should replace correct child', () => {
    const result = replaceContentItemWithId(template, child);
    let expected = {...template};
    (expected.content[0] as TemplateElement).content[1] = child;
    expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
  });

  it('should create a new object for all templates effected', () => {
    const result = replaceContentItemWithId(template, child);
    let resultFirst: TemplateElement = result.content[0] as TemplateElement;
    let templateFirst: TemplateElement = template.content[0] as TemplateElement;
    expect(result).not.toBe(template);
    expect(resultFirst).not.toBe(templateFirst);
    expect(resultFirst.content[1]).not.toBe(templateFirst.content[1]);

    expect(resultFirst.content[0]).toBe(templateFirst.content[0]);
    expect(result.content[1]).toBe(template.content[1]);

  });

  it('should return same object if child doesn\'t exist', () => {
    const result = replaceContentItemWithId(template, {
      name: 'span',
      id: 'ss2000',
      content: [],
      attributes: [],
      dynamicAttributes: []
    });
    expect(result).toBe(template);
  });
});
