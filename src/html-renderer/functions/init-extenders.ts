import { Dict, NullableValue, partial } from '../../core';
import { getProperty } from '../../view';
import { ExtenderDescriptor } from '../types-and-interfaces/extender.descriptor';

export function initExtenders(properties: Dict<NullableValue>,
                              extenders: ExtenderDescriptor[],
                              nativeElement: any) {
  let oldProperties: Dict<NullableValue> | null = null;
  const results = extenders.map((e) => e.initiateExtender(nativeElement));
  const updates = results.map((r) => r.update);
  const destroy = () => {
    results.forEach((r) => {
      if (r.onBeforeDestroy) {
        r.onBeforeDestroy();
      }
    });
  };
  const propertyChange: (props: Dict<NullableValue>) => void = (newProperties: Dict<NullableValue>) => {
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
      update(newValue, oldValue, newProperties);
    });
    oldProperties = newProperties;
  };
  propertyChange(properties);
  return {
    destroy,
    propertyChange
  };
}
