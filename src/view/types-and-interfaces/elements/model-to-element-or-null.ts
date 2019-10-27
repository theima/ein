import { Value } from '../../../core';
import { Element } from './element';

export type ModelToElementOrNull = (m: Value, im: Value) => Element | null;
