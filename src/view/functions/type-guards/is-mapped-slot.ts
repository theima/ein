import { Element } from '../../types-and-interfaces/elements/element';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { Slot } from '../../types-and-interfaces/slots/slot';
import { ElementTemplate } from '../..';
import { MappedSlot } from '../../types-and-interfaces/slots/mapped.slot';

export function isMappedSlot(item: ElementTemplate | ModelToString | Slot | Element | string | MappedSlot): item is MappedSlot {
  return !!(item as MappedSlot).mappedSlot;
}
