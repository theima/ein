export type ModelValueMap = (model: object | string | number | boolean | any[],
                             ...rest: Array<string | number | boolean>) => object | string | number | boolean | any[];
