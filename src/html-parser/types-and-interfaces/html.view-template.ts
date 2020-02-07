import { Property } from '../../view/types-and-interfaces/property';

export interface HtmlViewTemplate {
  name: string;
  children: string;
  properties: Property[];
}
