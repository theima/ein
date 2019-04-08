import { ElementData, TemplateElement } from '../..';
import { isGroupElementData } from '../type-guards/is-group-element-data';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { isNodeElementData } from '../type-guards/is-node-element-data';

export function addModifierAttributes<T extends TemplateElement>(element: T, data: ElementData | null): T {
  if (isGroupElementData(data)) {
    const attributes = element.attributes.concat([{name: BuiltIn.Group, value: true}]);
    element = {...element, attributes};
  }
  if (isNodeElementData(data)) {
    const attributes = element.attributes.concat([{name: BuiltIn.NodeMap, value: data.actionMapOrActionMaps}]);
    element = {...element, attributes};
  }
  return element;
}
