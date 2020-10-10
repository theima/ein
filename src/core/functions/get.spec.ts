import { get } from './get';

describe('Get', () => {
  let model: Record<string, Record<string, Record<string, string>>>;
  beforeEach(() => {
    model = {
      level_one: {
        level_two: {
          level_three: ''
        }
      }
    };
  });
  it('should return model if no properties', () => {
    expect(get(model)).toBe(model);
  });
  it('should select on level 1', () => {
    expect(get(model, 'level_one')).toBe(model.level_one);
  });
  it('should select on level 2', () => {
    expect(get(model, 'level_one', 'level_two')).toBe(model.level_one.level_two);
  });

  it('should select on level 3', () => {
    expect(get(model, 'level_one', 'level_two', 'level_three')).toBe(model.level_one.level_two.level_three);
  });

});
