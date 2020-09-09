
import { NodeAsync } from '../../../node-async/index';
import { ModelToElement, ViewTemplate } from '../../index';
import { elementMap } from './element.map';

export function rootElementMap(getViewTemplate: (name: string) => ViewTemplate | undefined, viewName: string, node: NodeAsync<any>): ModelToElement {
  const mainTemplate = {
    name: viewName,
    content: [],
    properties: []
  };
  let mainViewTemplate: ViewTemplate | undefined = getViewTemplate(viewName);
  if (!mainViewTemplate) {
    // throwing for now
    throw new Error('could not find view for root');
  }

  mainViewTemplate = {...mainViewTemplate};
  let id = 0;
  const getId = () => {
    return '' + id++ ;
  };
  const childGetViewTemplate = (name: string) => {
    if (name === viewName) {
      return mainViewTemplate;
    }
    return getViewTemplate(name);
  };
  return elementMap([], getId, childGetViewTemplate, '0', node, mainTemplate) as ModelToElement;
}
