import { Dict, NullableValue, partial } from '../../core';
import { Element, getProperty } from '../../view';
import { Property } from '../../view/types-and-interfaces/property';
import { ExtenderDescriptor } from '../types-and-interfaces/extender.descriptor';

export function initExtenders(toDict: (p: Property[]) => Dict<NullableValue>,
                              element: Element,
                              extenders: ExtenderDescriptor[],
                              nativeElement: any) {
  let oldProperties: Property[] | null = null;
  const results = extenders.map((e) => e.initiateExtender(nativeElement));
  const updates = results.map((r) => r.update);
  const destroy = () => {
    results.forEach((r) => {
      if (r.onBeforeDestroy) {
        r.onBeforeDestroy();
      }
    });
  };
  const propertyChange: (props: Property[]) => void = (newProperties: Property[]) => {
    updates.forEach((update, index) => {
      const getPropertyForExtender = partial(getProperty, extenders[index].name);
      const newProperty = getPropertyForExtender(newProperties as any) as any;
      const newValue = newProperty.value;
      let oldValue;
      if (oldProperties) {
        const oldAttribute = getPropertyForExtender(oldProperties as any);
        if (oldAttribute) {
          oldValue = oldAttribute.value;
        }
      }
      update(newValue, oldValue, toDict(newProperties));
    });
    oldProperties = newProperties;
  };
  propertyChange(element.properties);
  return {
    destroy,
    propertyChange
  };
}
