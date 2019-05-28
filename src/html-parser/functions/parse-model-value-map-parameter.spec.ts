import { parseModelValueMapParameter } from './parse-model-value-map-parameter';

describe('parseModelValueMapParameter', () => {
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
      expect(parseModelValueMapParameter(model, 'a')).toBe(model.a);
    });

    it('should return value for model param with object', () => {
      expect(parseModelValueMapParameter(model, 'b')).toBe(model.b);
    });

    it('should return value as number for numbers', () => {
      expect(parseModelValueMapParameter(model, '5')).toBe(5);
    });

    it('should return a string for string parameter with " ', () => {
      expect(parseModelValueMapParameter(model, '"five"')).toBe('five');
    });

    it('should return a string for string parameter with \' ', () => {
      expect(parseModelValueMapParameter(model, '\'five\'')).toBe('five');
    });

    it('should return null for non model param', () => {
      expect(parseModelValueMapParameter(model, 'c')).toBeNull();
    });

    it('should return true', () => {
      expect(parseModelValueMapParameter(model, 'true')).toBe(true);
    });

    it('should return false', () => {
      expect(parseModelValueMapParameter(model, 'false')).toBe(false);
    });

    it('should return 0 for 0', () => {
      expect(parseModelValueMapParameter(model, 'd')).toBe(0);
    });

    it('should return false for false on the model', () => {
      expect(parseModelValueMapParameter(model, 'e')).toBe(false);
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
      expect(parseModelValueMapParameter(model, '5')).toBe('five');
    });

    it('should return value for param named true', () => {
      expect(parseModelValueMapParameter(model, 'true')).toBe('it is true');
    });

    it('should return value for param named false', () => {
      expect(parseModelValueMapParameter(model, 'false')).toBe('it is false');
    });
  });
});
