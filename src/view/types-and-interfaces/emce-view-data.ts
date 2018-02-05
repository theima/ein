import { ViewData } from './view-data';
import { Property } from './property';

export interface EmceViewData extends ViewData{
  createChildFrom: (properties: Property[]) => string[];
}
