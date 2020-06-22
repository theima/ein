import { NodeBehaviorSubject } from '../node-behavior-subject';
import { MockActionMapBuilder } from '../test-helpers/action-map.mock';
import { create } from './create';

describe('create', () => {
  it('should create a node', () => {
    const model: any = {};
    const mapBuilder: MockActionMapBuilder = new MockActionMapBuilder();
    const result = create(mapBuilder.createActionMaps().actionMap, model);
    expect(result instanceof NodeBehaviorSubject).toBeTruthy();
  });
});
