import { Dict, fromDict, NullableValue } from '../../core';
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
      const newProperty = fromDict(newProperties,extenders[index].name);
      const newValue = newProperty!;
      let oldValue;
      if (oldProperties) {
        oldValue = fromDict(oldProperties, extenders[index].name);
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
