/* eslint-disable */
import { getModel } from './get-model';

describe('getModel', () => {
  let model: any;
  beforeEach(() => {
    model = {
      model: 'abc',
      item: 'sss',
    };
  });

  it('should return model for model', () => {
    expect(getModel(model, 'model')).toBe(model);
  });

  it('should return model.model for model.model', () => {
    expect(getModel(model, 'model.model')).toBe(model.model);
  });

  it('should return model.item for model.item', () => {
    expect(getModel(model, 'model.item')).toBe(model.item);
  });
});
