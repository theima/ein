import { Dict, NullableValue, partial, Value } from '../../../core';
import { dictsIdentical } from '../../../core/functions/dict/dicts-identical';
import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { Extender } from '../../types-and-interfaces/extender/extender';
import { ExtenderCallbacks } from '../../types-and-interfaces/extender/extender-callbacks';
import { TemplateToElement } from '../../types-and-interfaces/to-rendered-content/template-to-element';
import { ViewScope } from '../../types-and-interfaces/to-rendered-content/view-scope';
import { mapPropertiesToDict } from './extender/map-properties-to-dict';

export function extenderModifier(
  getExtender: (name: string) => Extender | undefined,
  next: TemplateToElement
): TemplateToElement {
  const getExtenders = (elementTemple: ElementTemplate) => {
    const matching: Extender[] = [];
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
      const toProps = partial(mapPropertiesToDict, elementTemplate.properties);
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
      let props: Dict<NullableValue>;
      const propertyUpdate = (m: Value) => {
        oldPropertyUpdate?.(m);
        const oldProps = props;
        props = toProps(m);
        if (oldProps && dictsIdentical(oldProps, props)) {
          props = oldProps;
        } else {
          extenders.forEach((e, i) => {
            const curr = props?.[e.name];
            const old = oldProps?.[e.name];
            initiated[i].onUpdate(curr, old, props);
          });
        }
      };
      result = { ...result, onDestroy, afterAdd, propertyUpdate };
    }
    return result;
  };
}
