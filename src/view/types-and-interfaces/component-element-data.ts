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
  createStream: (content: Array<TemplateElement | ModelToString>,
                 create: (elements: Array<TemplateElement | ModelToString>) => Array<ModelToElementOrNull | ModelToString | ModelToElements>,
                 select: Select) => {
    stream: Observable<Array<Element | string>>,
    updateChildren: (attributes: Attribute[]) => void;
    completeStream: () => void;
  };
  setElementLookup: SetNativeElementLookup<any>;
}
