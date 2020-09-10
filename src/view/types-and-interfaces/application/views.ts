import { ValueMapDescriptor } from '../../../html-parser';
import { View } from '../view';
import { ViewTemplate } from '../view-templates/view-template';

export interface Views {
  views: Array<View<ViewTemplate>>;
  maps?: ValueMapDescriptor[];
}
