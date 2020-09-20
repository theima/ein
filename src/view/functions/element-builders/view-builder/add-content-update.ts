import { Value } from '../../../../core';
import { ElementTemplate } from '../../../types-and-interfaces/element-template/element-template';
import { ModelUpdate } from '../../../types-and-interfaces/model-update';
import { ModifierProperty } from '../../../types-and-interfaces/modifier-property';
import { DynamicElement } from '../../../types-and-interfaces/to-rendered-content/dynamic-element';
import { getModel } from '../../get-model';
import { getProperty } from '../../get-property';

export function addContentUpdate(elementTemplate: ElementTemplate, element: DynamicElement, slotContentUpdate?: ModelUpdate): DynamicElement {
  const elementContentUpdate = element.contentUpdate;
  let contentUpdate: ModelUpdate;
  let viewUpdate: ModelUpdate = (m: Value) => {
    elementContentUpdate?.(m);
    slotContentUpdate?.(m);
  };
  const selectProp = getProperty(ModifierProperty.Select, elementTemplate);
  if (!!selectProp && typeof selectProp.value === 'string') {
    const keystring: string = selectProp.value;
    let modelMap = (m: Value) => {
      return getModel(m, keystring) as Value;
    };
    contentUpdate = (m: Value) => {
      m = modelMap(m);
      viewUpdate(m);
    };
  } else {
    contentUpdate = viewUpdate;
  }
  return { ...element, contentUpdate };
}
