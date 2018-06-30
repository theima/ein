import { ModelToElement, ElementData, NodeElementData } from '../index';
import { isNodeElementData } from './is-node-element-data';
import { NodeAsync } from '../../node-async/index';
import { elementMap } from './element.map';

export function rootElementMap(getElement: (name: string) => ElementData | NodeElementData | null, viewName: string, node: NodeAsync<any>): ModelToElement {
  const mainTemplate = {
    name: viewName,
    content: [],
    attributes: []
  };
  const mainElementData: ElementData | null = getElement(viewName);
  if (!isNodeElementData(mainElementData)) {
    //throwing for now
    throw new Error('root must be a node view');
  }
  return elementMap(getElement, mainTemplate, node, mainElementData);
}
