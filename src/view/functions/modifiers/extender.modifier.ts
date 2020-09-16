import { Dict, NullableValue, partial, Value } from '../../../core';
import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { Extender } from '../../types-and-interfaces/extender/extender';
import { ExtenderCallbacks } from '../../types-and-interfaces/extender/extender-callbacks';
import { TemplateToElement } from '../../types-and-interfaces/to-rendered-content/template-to-element';
import { ViewScope } from '../../types-and-interfaces/to-rendered-content/view-scope';
import { mapPropertiesToDict } from './extender/map-properties-to-dict';

export function extenderModifier(getExtender: (name: string) => Extender | undefined, next: TemplateToElement) {
  const getExtenders = (elementTemple: ElementTemplate) => {
    let matching: Extender[] = [];
    elementTemple.properties.forEach((p) => {
      const extender = getExtender(p.name);
      if (extender) {
        matching.push(extender);
      }
    });
    return matching;
  };

  return (scope: ViewScope, elementTemplate: ElementTemplate) => {
    const extenders = getExtenders(elementTemplate);
    let result = next(scope, elementTemplate);
    if (extenders.length) {
      let initiated: ExtenderCallbacks[];
      const afterAdd = (element: HTMLElement) => {
        initiated = extenders.map((e) => e.initiate(element));
      };
      const oldOnDestroy = result.onDestroy;
      const onDestroy = () => {
        oldOnDestroy?.();
        initiated.forEach((i) => {
          i.onBeforeDestroy?.();
        });
      };
      const oldPropertyUpdate = result.propertyUpdate;
      const toProps = partial(mapPropertiesToDict, elementTemplate.properties);
      let props: Dict<NullableValue>;
      const propertyUpdate = (m: Value) => {
        oldPropertyUpdate?.(m);
        const oldProps = props;
        props = toProps(m);
        extenders.forEach((e, i) => {
          const curr = props?.[e.name];
          const old = oldProps?.[e.name];
          initiated[i].onUpdate(curr, old, props);
        });
      };
      result = { ...result, onDestroy, afterAdd, propertyUpdate };
    }
    return result;
  };
}
