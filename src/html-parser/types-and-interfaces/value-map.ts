import { Value } from '../../core/types-and-interfaces/value/value';

export type ValueMap = (model: Value,
                        ...rest: Value[]) => Value;
