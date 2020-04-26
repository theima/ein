import { parseValueMapParameter } from './parse-value-map-parameter';

describe('parseValueMapParameter', () => {
  let model: any;
  describe('basic cases', () => {
    beforeEach(() => {
      model = {
        a: 'aaa',
        b: {},
        d: 0,
        e: false
      };
    });
    it('should return value for model param', () => {
      expect(parseValueMapParameter(model, 'a')).toBe(model.a);
    });

    it('should return value for model param with object', () => {
      expect(parseValueMapParameter(model, 'b')).toBe(model.b);
    });

    it('should return value as number for numbers', () => {
      expect(parseValueMapParameter(model, '5')).toBe(5);
    });

    it('should return a string for string parameter with " ', () => {
      expect(parseValueMapParameter(model, '"five"')).toBe('five');
    });

    it('should return a string for string parameter with \' ', () => {
      expect(parseValueMapParameter(model, '\'five\'')).toBe('five');
    });

    it('should return true', () => {
      expect(parseValueMapParameter(model, 'true')).toBe(true);
    });

    it('should return false', () => {
      expect(parseValueMapParameter(model, 'false')).toBe(false);
    });

    it('should return 0 for 0', () => {
      expect(parseValueMapParameter(model, 'd')).toBe(0);
    });

    it('should return false for false on the model', () => {
      expect(parseValueMapParameter(model, 'e')).toBe(false);
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
      expect(parseValueMapParameter(model, '5')).toBe('five');
    });

    it('should return value for param named true', () => {
      expect(parseValueMapParameter(model, 'true')).toBe('it is true');
    });

    it('should return value for param named false', () => {
      expect(parseValueMapParameter(model, 'false')).toBe('it is false');
    });
  });
});
