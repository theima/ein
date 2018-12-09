import { Element } from './element';

export interface StaticElement extends Element{
  content: Array<Element | string>;
}
