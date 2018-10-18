import { ModelToElement, ElementData, NodeElementData } from '../index';
import { isNodeElementData } from './is-node-element-data';
import { NodeAsync } from '../../node-async/index';
import { elementMap } from './element.map';
import { ComponentElementData } from '../types-and-interfaces/component-element-data';

export function rootElementMap(getElementData: (name: string) => ElementData | NodeElementData | ComponentElementData | null, viewName: string, node: NodeAsync<any>): ModelToElement {
  const mainTemplate = {
    name: viewName,
    content: [],
    attributes: []
  };
  const mainElementData: ElementData | null = getElementData(viewName);
  if (!isNodeElementData(mainElementData)) {
    //throwing for now
    throw new Error('root must be a node view');
  }
  return elementMap(getElementData, mainTemplate, node, mainElementData);
}
