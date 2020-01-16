import { Value } from '../../../core';
import { Element } from './element';

export type ModelToElementOrNull = (m: Value) => Element | null;
