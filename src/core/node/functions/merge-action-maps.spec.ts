import { MockActionMapBuilder } from '../test-helpers/action-map.mock';
import { ActionMap } from '../types-and-interfaces/action-map';
import { mergeActionMaps } from './merge-action-maps';

describe('mergeActionMaps', () => {
  interface Model {
    one: any;
    two: any;
  }

  let actionMap: ActionMap<any>;
  let child1ActionMap: ActionMap<any>;
  let child2ActionMap: ActionMap<any>;
  let mapBuilder1: MockActionMapBuilder;
  let mapBuilder2: MockActionMapBuilder;
  let model: Model;
  beforeEach(() => {
    mapBuilder1 = new MockActionMapBuilder();
    child1ActionMap = mapBuilder1.createActionMaps().actionMap;
    mapBuilder2 = new MockActionMapBuilder();
    child2ActionMap = mapBuilder2.createActionMaps().actionMap;
    actionMap = mergeActionMaps({one: child1ActionMap, two: child2ActionMap});
    model = {
      one: {name: 'a'},
      two: {name: 'b'}
    };
  });
  it('should return unchanged model if no child changes it', () => {
    let result = actionMap(model, {type: 'a'});
    expect(result).toBe(model);
  });
  it('should send correct submodel to actionMap', () => {
    actionMap(model, {type: 'a'});
    expect(mapBuilder1.lastModelForActionMap).toBe(model.one);
  });
  it('should set correct submodel', () => {
    let subModel = {name: 'aa'};
    mapBuilder1.returnValue = subModel;
    let result = actionMap(model, {type: 'a'});
    expect(result.one).toBe(subModel);
  });
  it('should send \'null\' if no submodel exists', () => {
    model = {
      two: {name: 'b'}
    } as any;
    actionMap(model, {type: 'a'});
    expect(mapBuilder1.lastModelForActionMap).toBeNull();
  });
  describe('With root actionMap', () => {
    let rootBuilder: MockActionMapBuilder;
    let rootActionMap: ActionMap<any>;
    beforeEach(() => {
      rootBuilder = new MockActionMapBuilder();
      rootActionMap = rootBuilder.createActionMaps().actionMap;
      actionMap = mergeActionMaps(rootActionMap, {one: child1ActionMap, two: child2ActionMap});
    });
    it('should call child with result from root.', () => {
      let rootModelResult = {
        one: {name: 'a1'},
        two: {name: 'b1'}
      };
      rootBuilder.returnValue = rootModelResult;
      actionMap(model, {type: 'a'});
      expect(mapBuilder1.lastModelForActionMap).toBe(rootModelResult.one);
    });
    it('should return changed model if changed, but not by sub action maps', () => {
      let rootModelResult = {
        one: {name: 'a1'},
        two: {name: 'b1'}
      };
      rootBuilder.returnValue = rootModelResult;
      let result = actionMap(model, {type: 'a'});
      expect(result).toBe(rootModelResult);
    });
  });
});
