import { ModelToElement, ElementData } from '../../index';
import { isNodeElementData } from '../type-guards/is-node-element-data';
import { NodeAsync } from '../../../node-async/index';
import { elementMap } from './element.map';

export function rootElementMap(getElementData: (name: string) => ElementData | null, viewName: string, node: NodeAsync<any>): ModelToElement {
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
  let id = 0;
  const getId = () => {
    return id++;
  };
  return elementMap(getElementData, [], getId, '0', mainTemplate, node, mainElementData);
}
