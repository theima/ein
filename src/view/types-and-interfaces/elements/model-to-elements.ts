import { Element } from './element';
import { Value } from '../../../core';

export type ModelToElements = (m: Value, im: Value) => Array<Element | string>;
