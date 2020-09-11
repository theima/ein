
import { ActionMap } from '../../../html-parser/types-and-interfaces/action-map';
import { ElementTemplateContent } from '../element-template/element-template-content';

export interface ViewTemplate {
  name: string;
  content: ElementTemplateContent[];
  actionMap?: ActionMap;
}
