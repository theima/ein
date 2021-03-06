import { joinFunctions } from '../../../core';
import { DynamicElement } from '../../types-and-interfaces/to-rendered-content/dynamic-element';

export function addOnDestroy(element: DynamicElement, onDestroy?: () => void): DynamicElement {
  const existing = element.onDestroy;
  if (!onDestroy) {
    return element;
  }
  return {
    ...element,
    onDestroy: existing ? joinFunctions(existing, onDestroy) : onDestroy,
  };
}
