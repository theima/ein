import { Element } from './element';
import { Value } from '../../../core';

export type ModelToElementOrNull = (m: Value, im: Value) => Element | null;
