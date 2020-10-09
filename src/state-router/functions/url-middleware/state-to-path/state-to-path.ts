import { compile, Key, pathToRegexp } from 'path-to-regexp';
import { Dict } from '../../../../core';
import { removeKeysFromDict } from '../../../../core/functions/dict/remove-keys-from-dict';
import { State } from '../../../types-and-interfaces/state/state';
import { dictToQueryParams } from '../dict-to-query-params';

export function stateToPath(getPathMap: (name: string) => string, state: State): string | { error: any } | undefined {
  const pathMap: string = getPathMap(state.name);
  if (pathMap) {
    try {
      const regexpKeys: Key[] = [];
      pathToRegexp(pathMap, regexpKeys);
      const keysForState: string [] = regexpKeys.map((k) => k.name + '');
      const path: string = compile(pathMap)(state.params);
      const remainingParams: Dict<string | number | string[]> = removeKeysFromDict(state.params, ...keysForState);
      return path + dictToQueryParams(remainingParams);
    } catch (error) {
      return {error};
    }
  }
  return undefined;
}
