import { ComponentTemplate } from '../component/component';
import { Extender } from '../extender/extender';
import { View } from '../view';

export interface MediumExtenders {
  extenders?: Extender[];
  components?: Array<View<ComponentTemplate>>;
}
