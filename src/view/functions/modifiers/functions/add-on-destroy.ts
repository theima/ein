import { DynamicElement } from '../../../types-and-interfaces/to-element/dynamic-element';

export function addOnDestroy(element: DynamicElement, onDestroy: () => void): DynamicElement {
  const existing = element.onDestroy;
  return {
    ...element, onDestroy: () => {
      onDestroy();
      existing?.();
    }
  };
}
