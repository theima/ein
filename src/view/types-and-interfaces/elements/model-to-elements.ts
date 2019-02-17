import { Element } from './element';

export type ModelToElements = (m: object, im: object) => Array<Element | string>;
