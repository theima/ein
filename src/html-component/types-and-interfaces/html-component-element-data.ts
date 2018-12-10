import { Select } from '../../view/types-and-interfaces/select';
import { Element, TemplateElement, ViewEvent } from '../../view';
import { Observable } from 'rxjs';
import { SetNativeElementLookup } from '../../view/types-and-interfaces/set-native-element-lookup';
import { ModelToString } from '../../view/types-and-interfaces/model-to-string';
import { ModelToElementOrNull } from '../../view/types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../view/types-and-interfaces/elements/model-to-elements';
import { Attribute } from '../../view/types-and-interfaces/attribute';

export interface HtmlComponentElementData<T> {
  name: string;
  content: string;
  createStream: (content: Array<TemplateElement | ModelToString>,
                 create: (elements: Array<TemplateElement | ModelToString>) => Array<ModelToElementOrNull | ModelToString | ModelToElements>,
                 select: Select) => {
    stream: Observable<Array<Element | string>>,
    updateChildren: (attributes: Attribute[]) => void;
    completeStream: () => void;
    eventStream: Observable<ViewEvent>;
    setElementLookup: SetNativeElementLookup<T>;
  };
}
