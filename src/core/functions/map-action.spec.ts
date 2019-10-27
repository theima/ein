import { MockActionMapBuilder } from '../action-map.mock';
import { ActionMaps } from '../types-and-interfaces/action-maps';
import { mapAction } from './map-action';

describe('execute', () => {
  let mapBuilder: MockActionMapBuilder;
  let actionMaps: ActionMaps<any>;
  beforeEach(() => {
    mapBuilder = new MockActionMapBuilder();
    actionMaps = mapBuilder.createActionMaps();
  });
  it('should call actionMap with false', () => {
    spyOn(actionMaps, 'actionMap').and.callThrough();
    mapAction(actionMaps, false, {type: 's'});
    expect(mapBuilder.lastModelForActionMap === false).toBeTruthy();
  });
  it('should call actionMap with 0', () => {
    spyOn(actionMaps, 'actionMap').and.callThrough();
    mapAction(actionMaps, 0, {type: 's'});
    expect(mapBuilder.lastModelForActionMap === 0).toBeTruthy();
  });
});
