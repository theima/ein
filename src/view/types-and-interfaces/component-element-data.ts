import { ElementData } from './element-data';
import { SetNativeElementLookup } from './set-native-element-lookup';
import { Observable } from 'rxjs';
import { ModelToString } from './model-to-string';
import { ModelToElementOrNull } from './elements/model-to-element-or-null';
import { ModelToElements } from './elements/model-to-elements';
import { Element } from './elements/element';
import { TemplateElement } from './template-element';
import { Select } from './select';
import { Attribute } from './attribute';
import { ViewEvent } from './view-event';

export interface ComponentElementData extends ElementData {
  createStream: (content: Array<TemplateElement | ModelToString>,
                 create: (elements: Array<TemplateElement | ModelToString>) => Array<ModelToElementOrNull | ModelToString | ModelToElements>,
                 select: Select) => {
    stream: Observable<Array<Element | string>>,
    updateChildren: (attributes: Attribute[]) => void;
    completeStream: () => void;
    eventStream: Observable<ViewEvent>;
    setElementLookup: SetNativeElementLookup<any>;
  };
}
