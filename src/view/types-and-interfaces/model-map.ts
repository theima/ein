import { Property } from './property';

export type ModelMap = (properties: Property[]) => (m: object) => object;
