import { ModelToElement, ElementData } from '../../index';
import { NodeAsync } from '../../../node-async/index';
import { elementMap } from './element.map';
import { isViewElementData } from '../type-guards/is-view-element-data';
import { BuiltIn } from '../../types-and-interfaces/built-in';

export function rootElementMap(getElementData: (name: string) => ElementData | null, viewName: string, node: NodeAsync<any>): ModelToElement {
  const mainTemplate = {
    name: viewName,
    content: [],
    attributes: []
  };
  const mainElementData: ElementData | null = getElementData(viewName);
  const isNode = isViewElementData(mainElementData) && mainElementData.attributes.length && mainElementData.attributes.length[0].name === BuiltIn.NodeMap;
  if (!isNode) {
    //throwing for now
    throw new Error('root must be a node view');
  }
  let id = 0;
  const getId = () => {
    return id++;
  };
  return elementMap([], getId, getElementData, '0',mainElementData, node, mainTemplate);
}
