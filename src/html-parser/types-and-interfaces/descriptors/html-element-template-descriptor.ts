import { Property } from '../../../view/types-and-interfaces/property';

export interface HtmlElementTemplateDescriptor {
  name: string;
  children: string;
  properties: Property[];
}
