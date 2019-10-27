import { Value } from '../../core';

export type ValueMap = (model: Value,
                        ...rest: Value[]) => Value;
