import { View } from '../view';
import { ViewMap } from '../view-map';
import { ViewTemplate } from '../view-template/view-template';

export interface Views {
  views: Array<View<ViewTemplate>>;
  maps?: ViewMap[];
}
