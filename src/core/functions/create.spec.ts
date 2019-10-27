import { MockActionMapBuilder } from '../action-map.mock';
import { NodeBehaviorSubject } from '../node-behavior-subject';
import { create } from './create';

describe('create', () => {
  it('should create a node', () => {
    const model: any = {};
    const mapBuilder: MockActionMapBuilder = new MockActionMapBuilder();
    expect(create(mapBuilder.createActionMaps(), model) instanceof NodeBehaviorSubject).toBeTruthy();
  });
  it('should create a node with null', () => {
    const mapBuilder: MockActionMapBuilder = new MockActionMapBuilder();
    expect(create(mapBuilder.createActionMaps(), null) instanceof NodeBehaviorSubject).toBeTruthy();
  });
  it('should throw if we don\'t have an actionMap', () => {
    const model: any = {};
    expect(() => {
      create(null as any, model);
    }).toThrow();
  });
});
