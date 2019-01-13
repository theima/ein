import { ElementData } from './element-data';
import { ModelToString } from '../model-to-string';
import { ModelToElementOrNull } from '../elements/model-to-element-or-null';
import { ModelToElements } from '../elements/model-to-elements';
import { TemplateElement } from '../templates/template-element';
import { Select } from '../select';
import { CreateComponentResult } from '../create-component-result';
import { FilledSlot } from '../slots/filled.slot';
import { MappedSlot } from '../slots/mapped.slot';

export interface ComponentElementData extends ElementData {
  createComponent: (content: Array<TemplateElement | ModelToString | FilledSlot>,
                    create: (elements: Array<TemplateElement | ModelToString | FilledSlot>) => Array<ModelToElementOrNull | ModelToString | ModelToElements | MappedSlot>,
                    select: Select) => CreateComponentResult;
}
