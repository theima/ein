import { Element } from './element';
import { Value } from '../../../core';

export type ModelToElement = (m: Value, im: Value) => Element;
