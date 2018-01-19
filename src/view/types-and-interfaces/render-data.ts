import {Property} from './property';
import {TemplateElement} from './template-element';
import {TemplateString} from './template-string';
import {DynamicProperty} from './dynamic-property';
import {ModelMap} from './model-map';
import {TemplateValidator} from './template-validator';

export interface RenderData {
  tag: string;
  properties: Property[];
  dynamicProperties: DynamicProperty[];
  templates: Array<TemplateElement | TemplateString>;
  modelMap: ModelMap;
  templateValidator: TemplateValidator;
}
