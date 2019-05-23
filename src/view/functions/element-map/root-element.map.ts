import { ModelToElement, ElementData } from '../../index';
import { NodeAsync } from '../../../node-async/index';
import { elementMap } from './element.map';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { getArrayElement } from '../../../core/functions/get-array-element';

export function rootElementMap(getElementData: (name: string) => ElementData | null, viewName: string, node: NodeAsync<any>): ModelToElement {
  const mainTemplate = {
    name: viewName,
    content: [],
    properties: []
  };
  let mainElementData: ElementData | null = getElementData(viewName);
  if (!mainElementData) {
    //throwing for now
    throw new Error('could not find view for root');
  }

  if (!getArrayElement('name', mainElementData.properties, BuiltIn.ConnectActions)) {
    throw new Error('root must be a node view');
  }
  const attributes = mainElementData.properties.filter(a => a.name === BuiltIn.ConnectActions);
  mainElementData = {...mainElementData, properties: attributes};
  let id = 0;
  const getId = () => {
    return id++;
  };
  const childGetElementData = (name: string) => {
    if (name === viewName) {
      return mainElementData;
    }
    return getElementData(name);
  };
  return elementMap([], getId, childGetElementData, '0', node, mainTemplate) as ModelToElement;
}
