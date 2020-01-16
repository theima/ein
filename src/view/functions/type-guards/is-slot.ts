import { ElementTemplate } from '../..';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { Element } from '../../types-and-interfaces/elements/element';
import { Slot } from '../../types-and-interfaces/slots/slot';

export function isSlot(item: ElementTemplate | ModelToString | Slot | Element | string): item is Slot {
  return !!(item as Slot).slot;
}
