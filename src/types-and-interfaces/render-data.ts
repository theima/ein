import {Attribute} from './attribute';
import {TemplateElement} from './template-element';
import {TemplateString} from './template-string';
import {DynamicAttribute} from './dynamic-attribute';
import {ViewMap} from './view-map';
import {ViewValidator} from './view-validator';

export interface RenderData {
  tag: string;
  attributes: Attribute[];
  dynamicAttributes: DynamicAttribute[];
  templates: Array<TemplateElement | TemplateString>;
  viewMap: ViewMap;
  viewValidator: ViewValidator;
}
