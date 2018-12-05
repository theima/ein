import { ModelToElement, ElementData } from '../../index';
import { isNodeElementData } from '../is-node-element-data';
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
    //tslint:disable-next-line
    console.log('creating id:', id + 1);
    return id++;
  };
  return elementMap(getElementData, [], getId , mainTemplate, node, mainElementData);
}
