type BaseValue = object | string | number | boolean | ((...args: Value[]) => Value);
interface ValueObject { [prop: string]: BaseValue | ValueObject | Array<BaseValue | ValueObject>; }
export type Value = BaseValue | ValueObject | Array<BaseValue | ValueObject>;
