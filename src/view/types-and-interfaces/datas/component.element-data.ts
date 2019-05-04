import { ElementData } from './element-data';
import { ModelToString } from '../model-to-string';
import { ModelToElementOrNull } from '../elements/model-to-element-or-null';
import { ModelToElements } from '../elements/model-to-elements';
import { TemplateElement } from '../templates/template-element';
import { Select } from '../select';
import { CreateComponentResult } from '../create-component-result';
import { FilledSlot } from '../slots/filled.slot';
import { MappedSlot } from '../slots/mapped.slot';
import { FilledTemplateElement } from '../templates/filled.template-element';

export interface ComponentElementData extends ElementData {
  createComponent: (id: string,
                    content: Array<TemplateElement | ModelToString | FilledSlot>,
                    create: (elements: Array<FilledTemplateElement | ModelToString | FilledSlot>) => Array<ModelToElementOrNull | ModelToString | ModelToElements | MappedSlot>,
                    select: Select) => CreateComponentResult;
}
