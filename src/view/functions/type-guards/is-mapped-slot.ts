import { ElementTemplate } from '../..';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { Element } from '../../types-and-interfaces/elements/element';
import { MappedSlot } from '../../types-and-interfaces/slots/mapped.slot';
import { Slot } from '../../types-and-interfaces/slots/slot';

export function isMappedSlot(item: ElementTemplate | ModelToString | Slot | Element | string | MappedSlot): item is MappedSlot {
  return !!(item as MappedSlot).mappedSlot;
}
