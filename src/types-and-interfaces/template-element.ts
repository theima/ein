import {EventHandler} from './event-handler';
import {Attribute} from './attribute';
import {TemplateString} from './template-string';
import {DynamicAttribute} from './dynamic-attribute';

export interface TemplateElement {
  tag: string;
  attributes: Attribute[];
  dynamicAttributes: DynamicAttribute[];
  children: Array<TemplateElement | TemplateString>;
  id?: string;
  eventHandlers?: EventHandler[];
}
