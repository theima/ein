import {parseTemplateParameter} from './parse-template-parameter';

describe('parseTemplateParameter', () => {
  let model: any;
  describe('basic cases', () => {
    beforeEach(() => {
      model = {
        a: 'aaa',
        b: {}
      };
    });
    it('should return value for model param', () => {
      expect(parseTemplateParameter(model, 'a')).toBe(model.a);
    });

    it('should return value for model param with object', () => {
      expect(parseTemplateParameter(model, 'b')).toBe(model.b);
    });

    it('should return value as number for numbers', () => {
      expect(parseTemplateParameter(model, '5')).toBe(5);
    });

    it('should return a string for string parameter with " ', () => {
      expect(parseTemplateParameter(model, '"five"')).toBe('five');
    });

    it('should return a string for string parameter with \' ', () => {
      expect(parseTemplateParameter(model, '\'five\'')).toBe('five');
    });

    it('should return null for non model param', () => {
      expect(parseTemplateParameter(model, 'c')).toBeNull();
    });

    it('should return true', () => {
      expect(parseTemplateParameter(model, 'true')).toBe(true);
    });

    it('should return false', () => {
      expect(parseTemplateParameter(model, 'false')).toBe(false);
    });
  });

  describe('special cases', () => {
    beforeEach(() => {
      model = {
        5: 'five',
        true: 'it is true',
        false: 'it is false'
      };
    });
    it('should return value for numbered model param', () => {
      expect(parseTemplateParameter(model, '5')).toBe('five');
    });

    it('should return value for param named true', () => {
      expect(parseTemplateParameter(model, 'true')).toBe('it is true');
    });

    it('should return value for param named false', () => {
      expect(parseTemplateParameter(model, 'false')).toBe('it is false');
    });
  });
});
