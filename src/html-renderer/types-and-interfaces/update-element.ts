import { Dict, NullableValue } from '../../core';

export type UpdateElement = (newValue: NullableValue,
                             oldValue: NullableValue | undefined,
                             properties: Dict<NullableValue>) => void;
