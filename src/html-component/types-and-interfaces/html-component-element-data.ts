import { Select } from '../../view/types-and-interfaces/select';
import { Element, TemplateElement, ViewEvent } from '../../view';
import { Observable } from 'rxjs/internal/Observable';
import { SetNativeElementLookup } from '../../view/types-and-interfaces/set-native-element-lookup';
import { Dict } from '../../core';
import { ModelToString } from '../../view/types-and-interfaces/model-to-string';
import { ModelToElementOrNull } from '../../view/types-and-interfaces/model-to-element-or-null';
import { ModelToElements } from '../../view/types-and-interfaces/model-to-elements';
import { Attribute } from '../../view/types-and-interfaces/attribute';

export interface HtmlComponentElementData<T> {
  name: string;
  content: string;
  events?: (select: Select) => Observable<ViewEvent>;
  setElementLookup: SetNativeElementLookup<T>;
  createStream: (content: Array<TemplateElement | ModelToString>,
                 attributes: Observable<Dict<string | number | boolean>>,
                 create: (elements: Array<TemplateElement | ModelToString>) => Array<ModelToElementOrNull | ModelToString | ModelToElements>,
                 select: Select) => Observable<Array<Element | string>>;
  updateChildren: (attributes: Attribute[]) => void;
}
