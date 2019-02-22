import { StateParams } from '../../types-and-interfaces/state-params';
import { paramArraysEqual } from './param-arrays-equal';
import { dictToArray } from '../../../core';

export function paramsEqual(a: StateParams, b: StateParams): boolean {
  for (let key in a) {
    if (b[key] === undefined) {
      return false;
    }
    const propA = a[key];
    const propB = b[key];
    if (Array.isArray(propA)) {
      if (Array.isArray(propB)) {
        if (!paramArraysEqual(propA, propB)) {
          return false;
        }
      } else {
        return false;
      }
    } else if (propA !== propB) {
      return false;
    }
  }
  return dictToArray(a).length === dictToArray(b).length;
}
