import {Attribute} from './attribute';
import {TemplateElement} from './template-element';
import {TemplateString} from './template-string';
import {DynamicAttribute} from './dynamic-attribute';
import {ModelMap} from './model-map';
import {TemplateValidator} from './template-validator';

export interface RenderData {
  tag: string;
  attributes: Attribute[];
  dynamicAttributes: DynamicAttribute[];
  templates: Array<TemplateElement | TemplateString>;
  modelMap: ModelMap;
  templateValidator: TemplateValidator;
}
