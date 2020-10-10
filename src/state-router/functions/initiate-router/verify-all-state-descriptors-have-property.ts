import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';

export function verifyAllStateDescriptorsHaveProperty<
  k extends keyof StateDescriptor
>(descriptors: StateDescriptor[], property: k): boolean {
  const check = (descriptor: StateDescriptor) => {
    // eslint-disable-next-line eqeqeq
    return descriptor[property] != undefined;
  };
  const allHave: boolean = descriptors.every(check);
  if (!allHave) {
    const someHave = descriptors.some(check);
    if (someHave) {
      const missing = descriptors.filter((d) => !check(d)).map((d) => d.name);
      // throw for now.
      throw new Error(
        `"${property}" is missing from states: ${missing.join(' ')}.`
      );
    }
  }

  return true;
}
