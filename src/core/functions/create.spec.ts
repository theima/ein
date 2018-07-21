import { create } from './create';
import { NodeSubject } from '../node-subject';
import { MockActionMapBuilder } from '../action-map.mock';

describe('create', () => {
  it('should create a node', () => {
    const model: any = {};
    const mapBuilder: MockActionMapBuilder = new MockActionMapBuilder();
    expect(create(mapBuilder.createActionMaps(), model) instanceof NodeSubject).toBeTruthy();
  });
  it('should create a node with null', () => {
    const mapBuilder: MockActionMapBuilder = new MockActionMapBuilder();
    expect(create(mapBuilder.createActionMaps(), null) instanceof NodeSubject).toBeTruthy();
  });
  it('should throw if we don\'t have an actionMap', () => {
    const model: any = {};
    expect(() => {
      create(null as any, model);
    }).toThrow();
  });
});
