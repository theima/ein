import { getArrayElement } from '../../../core/functions/get-array-element';
import { NodeAsync } from '../../../node-async/index';
import { ModelToElement, ViewTemplate } from '../../index';
import { BuiltIn } from '../../types-and-interfaces/built-in';
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

  if (!getArrayElement('name', mainViewTemplate.properties, BuiltIn.ConnectActionsToNode)) {
    throw new Error('root must be a node view');
  }
  const properties = mainViewTemplate.properties.filter((a) => a.name === BuiltIn.ConnectActionsToNode || a.name === BuiltIn.Actions);
  mainViewTemplate = {...mainViewTemplate, properties};
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
