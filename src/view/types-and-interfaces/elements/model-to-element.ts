import { Value } from '../../../core';
import { Element } from './element';

export type ModelToElement = (m: Value) => Element | undefined;
