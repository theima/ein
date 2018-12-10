import { Select } from '../../view/types-and-interfaces/select';
import { TemplateElement } from '../../view';
import { ModelToString } from '../../view/types-and-interfaces/model-to-string';
import { ModelToElementOrNull } from '../../view/types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../view/types-and-interfaces/elements/model-to-elements';
import { CreateComponentResult } from '../../view/types-and-interfaces/create-component-result';

export interface HtmlComponentElementData<T> {
  name: string;
  content: string;
  createComponent: (content: Array<TemplateElement | ModelToString>,
                    create: (elements: Array<TemplateElement | ModelToString>) => Array<ModelToElementOrNull | ModelToString | ModelToElements>,
                    select: Select) => CreateComponentResult;
}
