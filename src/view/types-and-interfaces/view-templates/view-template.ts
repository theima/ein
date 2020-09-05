
import { ActionMap } from '../../../html-parser/types-and-interfaces/action-map';
import { Property } from '../property';
import { ElementTemplateContent } from '../templates/element-template-content';

export interface ViewTemplate {
  name: string;
  children: ElementTemplateContent[];
  properties: Property[];
  actionMap?: ActionMap;
}
