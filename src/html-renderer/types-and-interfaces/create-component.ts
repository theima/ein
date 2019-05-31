import { ElementTemplate, Select } from '../../view';
import { ModelToString } from '../../view/types-and-interfaces/model-to-string';
import { FilledSlot } from '../../view/types-and-interfaces/slots/filled.slot';
import { FilledElementTemplate } from '../../view/types-and-interfaces/templates/filled.element-template';
import { CreateComponentResult } from './create-component-result';
import { ModelToElementOrNull } from '../../view/types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../view/types-and-interfaces/elements/model-to-elements';
import { MappedSlot } from '../../view/types-and-interfaces/slots/mapped.slot';

export type CreateComponent = (id: string,
                               content: Array<ElementTemplate | ModelToString | FilledSlot>,
                               create: (elements: Array<FilledElementTemplate | ModelToString | FilledSlot>) => Array<ModelToElementOrNull | ModelToString | ModelToElements | MappedSlot>,
                               select: Select) => CreateComponentResult;
