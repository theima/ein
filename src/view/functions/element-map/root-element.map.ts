import { ModelToElement, ElementData } from '../../index';
import { NodeAsync } from '../../../node-async/index';
import { elementMap } from './element.map';
import { isViewElementData } from '../type-guards/is-view-element-data';
import { BuiltIn } from '../../types-and-interfaces/built-in';

export function rootElementMap(getElementData: (name: string) => ElementData | null, viewName: string, node: NodeAsync<any>): ModelToElement {
  const mainTemplate = {
    name: viewName,
    content: [],
    attributes: [{name: BuiltIn.Subscribe, value:true}]
  };
  let mainElementData: ElementData | null = getElementData(viewName);
  if (!mainElementData) {
    //throwing for now
    throw new Error('could not find view for root');
  }
  if (!isViewElementData(mainElementData)) {
    throw new Error('root must be a view');
  }
  mainElementData = {...mainElementData, attributes:[]};
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
