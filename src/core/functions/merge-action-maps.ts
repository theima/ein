import { ActionMap } from '../types-and-interfaces/action-map';
import { SubActionMaps } from './sub-action-maps';
import { give } from './give';
import { get } from '../index';
import { Action } from '../types-and-interfaces/action';

export function mergeActionMaps<T>(subActionMaps: SubActionMaps): ActionMap<T>;
export function mergeActionMaps<T>(actionMap: ActionMap<T>, subActionMaps: SubActionMaps): ActionMap<T>;
export function mergeActionMaps<T>(actionMapOrSubActionMaps: ActionMap<T> | SubActionMaps, subActionMaps?: SubActionMaps): ActionMap<T> {
  let actionMap: ActionMap<T>;
  const subMaps: SubActionMaps = subActionMaps ? subActionMaps : actionMapOrSubActionMaps as any;
  if (typeof actionMapOrSubActionMaps === 'function') {
    actionMap = actionMapOrSubActionMaps;
  }
  let keys: string[] = Object.keys(subMaps);
  return (model: T, action: Action) => {
    let result: T = {} as any;
    if (actionMap) {
      model = actionMap(model, action);
    }
    let subModelChanged: boolean = false;
    keys.forEach((key) => {
      const subMap: ActionMap<any> = subMaps[key];
      const subModel: any = get(model, key);
      const subResult: any = subMap(subModel, action);
      subModelChanged = subModelChanged || subModel !== subResult;
      result = give(result, subResult, key);
    });

    return subModelChanged ? result : model as T;
  };
}
