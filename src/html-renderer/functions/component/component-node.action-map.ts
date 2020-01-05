import { Action, Dict, NullableValue } from '../../../core';

export function componentNodeActionMap(m: Dict<NullableValue>, a: Action): Dict<NullableValue> {
    return a.properties || m;
  }
