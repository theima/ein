import { Dict, NullableValue } from '../../../core';

export type OnPropertyUpdate = (newValue: NullableValue,
                                oldValue: NullableValue | undefined,
                                properties: Dict<NullableValue>) => void;
