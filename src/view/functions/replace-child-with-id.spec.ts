import { replaceContentItemWithId } from './replace-child-with-id';
import { ModelToString } from '../types-and-interfaces/model-to-string';

describe('replaceContentItemWithId', () => {
  interface Test { name: string; id?: string; content: Array<Test | ModelToString>; }
  let template: Test;
  let child: Test;
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
              content: []
            },
            {
              name: 'div',
              id: 'ss2',
              content: []
            },
            {
              name: 'div',
              id: 'ss3',
              content: []
            }
          ]
        },
        {
          name: 'div',
          id: 'ff',
          content: [
            {
              name: 'div',
              id: 'ff1',
              content: []
            },
            {
              name: 'div',
              id: 'ff2',
              content: []
            },
            {
              name: 'div',
              id: 'ff3',
              content: []
            }
          ]
        }
      ]
    };
    child = {
      name: 'span',
      id: 'ss2',
      content: []
    };
  });

  it('should replace correct child', () => {
    const result = replaceContentItemWithId(template, child);
    let expected = {...template};
    (expected.content[0] as Test).content[1] = child;
    expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
  });

  it('should create a new object for all templates effected', () => {
    const result = replaceContentItemWithId(template, child);
    let resultFirst: Test = result.content[0] as Test;
    let templateFirst: Test = template.content[0] as Test;
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
      content: []
    });
    expect(result).toBe(template);
  });
});
