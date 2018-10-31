import { NodeAsync } from '../../../node-async/index';
import { ModelToElementOrNull } from '../../types-and-interfaces/model-to-element-or-null';
import { toElement } from './to-element';
import { ModelToElement, DynamicAttribute, ElementData, ModelMap, NodeElementData, ViewEvent } from '../../index';
import { isNodeElementData } from '../is-node-element-data';
import { insertContentInView } from '../insert-content-in-view';
import { ModelToElements } from '../../types-and-interfaces/model-to-elements';
import { partial } from '../../../core/index';
import { Observable } from 'rxjs';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { TemplateElement } from '../../types-and-interfaces/template-element';
import { applyModifiers } from '../apply-modifiers';
import { getArrayElement } from '../../../core/functions/get-array-element';
import { Modifier } from '../../types-and-interfaces/modifier';
import { Attribute } from '../../types-and-interfaces/attribute';
import { keyStringToSelectors } from '../../../html-template/functions/key-string-to-selectors';
import { Element } from '../../types-and-interfaces/element';
import { selectEvents } from '../select-events';
import { createApplyEventHandlers } from '../create-apply-event-handlers';
import { ComponentElementData } from '../../types-and-interfaces/component-element-data';
import { isComponentElementData } from '../is-component-element-data';
import { BuiltIn } from '../../../html-template/types-and-interfaces/built-in';
import { toComponentElement } from './to-component-element';

export function elementMap(getElement: (name: string) => ElementData | NodeElementData | null,
                           templateElement: TemplateElement,
                           node: NodeAsync<object>,
                           elementData: ElementData | NodeElementData | ComponentElementData | null,
                           modelMap: ModelMap = m => m,
                           usedViews: string[] = []): ModelToElement {
  const create = (templateElement: TemplateElement, node: NodeAsync<object>, elementData: ElementData | NodeElementData | ComponentElementData | null, modelMap: ModelMap) => {
    return elementMap(getElement, templateElement, node, elementData, modelMap as any, usedViews);
  };
  const createNodeChildFrom = (attributes: Array<Attribute | DynamicAttribute>) => {
    const getAttr = partial(getArrayElement as any, 'name', attributes);
    const model: Attribute | DynamicAttribute | null = getAttr(Modifier.SelectChild) as any;
    if (model && typeof model.value === 'string') {
      return keyStringToSelectors(model.value as string, BuiltIn.Model);
    }
    return [];
  };
  const getNode = (templateElement: TemplateElement, elementData: ElementData | NodeElementData | ComponentElementData | null) => {
    if (isNodeElementData(elementData)) {
      const childSelectors: string[] = createNodeChildFrom(templateElement.attributes);
      // @ts-ignore-line
      return node.createChild(elementData.actionMapOrActionMaps, ...childSelectors);
    }
    return node;
  };
  const createChildElement: any = (childElement: TemplateElement) => {
    const childData: ElementData | null = getElement(childElement.name);
    return applyModifiers(create, getNode, createChildElement, childElement, childData);
  };
  const updateUsedViews = (usedViews: string [], elementData: ElementData | null) => {
    if (usedViews.length > 1000) {
      //simple test
      //throwing for now.
      throw new Error('Too many nested views');
    }
    return elementData ? [...usedViews, elementData.name] : usedViews;
  };
  usedViews = updateUsedViews(usedViews, elementData);
  //Any Slot in the TemplateElement.content will have been replaced by this time.
  let content: Array<TemplateElement | ModelToString> = templateElement.content as Array<TemplateElement | ModelToString>;
  if (elementData) {
    content = insertContentInView(elementData.content, content);
  }
  const contentMaps: Array<ModelToElementOrNull | ModelToString | ModelToElements> = content.map(
    (child) => {
      if (typeof child === 'function') {
        return child;
      }
      return createChildElement(child);
    }
  );

  let applyEventHandlers: (root: Element) => Element = element => element;
  let createElement: (model: object) => Element;
  let selectWithStream = null;
  let stream = null;

  if (isNodeElementData(elementData)) {
    selectWithStream = selectEvents(elementData.actions);
    applyEventHandlers = createApplyEventHandlers(selectWithStream.selects);
    node.next(selectWithStream.stream);
  } else if (elementData) {
    if (elementData.events) {
      selectWithStream = selectEvents(elementData.events);
      applyEventHandlers = createApplyEventHandlers(selectWithStream.selects);
      stream = selectWithStream.stream;
    } else {
      stream = new Observable<ViewEvent>();
    }
  }

  if (isComponentElementData(elementData)) {
    const b = stream as any;
    const tempTest = (a: any) =>  {
      const ce = partial(toComponentElement, templateElement.name, templateElement.attributes, contentMaps, b, elementData.setElementLookup);
      const result = ce(a);
      result.tempStream = null as any;//elementData.setElementMap()
      return result;
    };
    createElement = tempTest;
  } else {
    createElement = partial(toElement, templateElement.name, templateElement.attributes, contentMaps, stream, modelMap);
  }
  return (m: object) => {
    const result = createElement(m);
    return applyEventHandlers(result);
  };
}
