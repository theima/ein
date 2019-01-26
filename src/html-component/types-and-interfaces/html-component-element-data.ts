import { Select } from '../../view/types-and-interfaces/select';
import { TemplateElement } from '../../view';
import { ModelToString } from '../../view/types-and-interfaces/model-to-string';
import { ModelToElementOrNull } from '../../view/types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../view/types-and-interfaces/elements/model-to-elements';
import { CreateComponentResult } from '../../view/types-and-interfaces/create-component-result';
import { FilledSlot } from '../../view/types-and-interfaces/slots/filled.slot';
import { MappedSlot } from '../../view/types-and-interfaces/slots/mapped.slot';

export interface HtmlComponentElementData<T> {
  name: string;
  content: string;
  createComponent: (id: string,
                    content: Array<TemplateElement | ModelToString | FilledSlot>,
                    create: (elements: Array<TemplateElement | ModelToString | FilledSlot>) => Array<ModelToElementOrNull | ModelToString | ModelToElements | MappedSlot>,
                    select: Select) => CreateComponentResult;
}
