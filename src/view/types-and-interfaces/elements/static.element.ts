import { Element } from './element';
import { StaticElementContent } from './static-element-content';

export interface StaticElement extends Element {
  content: StaticElementContent;
}
