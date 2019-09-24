import { Module } from 'snabbdom/modules/module';
import { ComponentDescriptor } from '../types-and-interfaces/component.descriptor';

export function componentModule(getComponent: (name: string) => ComponentDescriptor | null): Module {

  return {
  } as any;
}
