import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';
import { verifyAllStateDescriptorsHaveProperty } from './verify-all-state-descriptors-have-property';

export function verifyStateDescriptors(
  descriptors: StateDescriptor[]
): boolean {
  const namesOk = descriptors.every((d) => !!d.name);
  if (!namesOk) {
    const bad = descriptors.filter((d) => !d.name);
    const statesText = bad.length > 1 ? 'states' : 'state';
    throw new Error(`"name" is missing from ${bad.length} ${statesText}.`);
  }
  const propertiesOk =
    verifyAllStateDescriptorsHaveProperty(descriptors, 'path') &&
    verifyAllStateDescriptorsHaveProperty(descriptors, 'title');
  return namesOk && propertiesOk;
}
