import { Property } from '../../view/types-and-interfaces/property';
import { Value } from '../../core';

export type UpdateElement = (newValue: Value  | null,
                             oldValue: Value | null | undefined,
                             properties: Property[]) => void;
