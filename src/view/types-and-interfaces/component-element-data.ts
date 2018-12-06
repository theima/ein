import { ElementData } from './element-data';
import { SetNativeElementLookup } from './set-native-element-lookup';
import { Observable } from 'rxjs';
import { ModelToString } from './model-to-string';
import { ModelToElementOrNull } from './model-to-element-or-null';
import { ModelToElements } from './model-to-elements';
import { Element } from './element';
import { TemplateElement } from './template-element';
import { Select } from './select';
import { Attribute } from './attribute';

export interface ComponentElementData extends ElementData {
  createStream: (create: (elements: Array<TemplateElement | ModelToString>) => Array<ModelToElementOrNull | ModelToString | ModelToElements>,
                 select: Select) => Observable<Array<Element | string>>;
  setElementLookup: SetNativeElementLookup<any>;
  updateChildren: (attributes: Attribute[]) => void;
}
