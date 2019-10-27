import { Value } from '../../../core';
import { Element } from './element';

export type ModelToElements = (m: Value, im: Value) => Array<Element | string>;
