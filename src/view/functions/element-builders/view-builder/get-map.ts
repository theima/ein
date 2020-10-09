import { Value } from '../../../../core';
import { ElementTemplate } from '../../../types-and-interfaces/element-template/element-template';
import { ModifierProperty } from '../../../types-and-interfaces/modifier-property';
import { getModel } from '../../get-model';
import { getProperty } from '../../get-property';

export function getMap(elementTemplate: ElementTemplate): (m: Value) => Value {
  const selectProperty = getProperty(ModifierProperty.Select, elementTemplate);
  let map: (m:Value) => Value;
  if (!!selectProperty && typeof selectProperty.value === 'string') {
    const k: string = selectProperty.value;
    map = (m: Value) => {
      return getModel(m, k) as Value;
    };

  } else {
    throw new Error(`${elementTemplate.name}: Property '${ModifierProperty.Select}' must be set for views and it must be a string`);
  }
  return map;
}
