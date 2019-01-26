import { Element } from './element';

export type ModelToElementOrNull = (m: object, im: object) => Element | null;
