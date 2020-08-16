import { Action, Dict, NullableValue } from '../../../core';

export function componentNodeReducer(m: Dict<NullableValue>, a: Action): Dict<NullableValue> {
    return a.properties || m;
  }
