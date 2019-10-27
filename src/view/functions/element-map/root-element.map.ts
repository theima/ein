import { getArrayElement } from '../../../core/functions/get-array-element';
import { NodeAsync } from '../../../node-async/index';
import { ElementTemplateDescriptor, ModelToElement } from '../../index';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { elementMap } from './element.map';

export function rootElementMap(getDescriptor: (name: string) => ElementTemplateDescriptor | null, viewName: string, node: NodeAsync<any>): ModelToElement {
  const mainTemplate = {
    name: viewName,
    content: [],
    properties: []
  };
  let mainDescriptor: ElementTemplateDescriptor | null = getDescriptor(viewName);
  if (!mainDescriptor) {
    //throwing for now
    throw new Error('could not find view for root');
  }

  if (!getArrayElement('name', mainDescriptor.properties, BuiltIn.ConnectActions)) {
    throw new Error('root must be a node view');
  }
  const properties = mainDescriptor.properties.filter(a => a.name === BuiltIn.ConnectActions);
  mainDescriptor = {...mainDescriptor, properties};
  let id = 0;
  const getId = () => {
    return '' + id++ ;
  };
  const childGetDescriptor = (name: string) => {
    if (name === viewName) {
      return mainDescriptor;
    }
    return getDescriptor(name);
  };
  return elementMap([], getId, childGetDescriptor, '0', node, mainTemplate) as ModelToElement;
}
