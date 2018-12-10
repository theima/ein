import { ElementData } from './element-data';
import { ModelToString } from './model-to-string';
import { ModelToElementOrNull } from './elements/model-to-element-or-null';
import { ModelToElements } from './elements/model-to-elements';
import { TemplateElement } from './template-element';
import { Select } from './select';
import { CreateComponentResult } from './create-component-result';

export interface ComponentElementData extends ElementData {
  createComponent: (content: Array<TemplateElement | ModelToString>,
                    create: (elements: Array<TemplateElement | ModelToString>) => Array<ModelToElementOrNull | ModelToString | ModelToElements>,
                    select: Select) => CreateComponentResult;
}
