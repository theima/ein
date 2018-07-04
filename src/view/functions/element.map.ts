import { ModelToElement } from '..';
import { NodeAsync } from '../../node-async';
import { ModelToElementOrNull } from '../types-and-interfaces/model-to-element-or-null';
import { toElement } from './to-element';
import { ElementData, ModelMap, NodeElementData, ViewEvent } from '../index';
import { isNodeElementData } from './is-node-element-data';
import { insertContentInView } from './insert-content-in-view';
import { EventStreamManager } from '../event-stream.manager/event-stream.manager';
import { ModelToElements } from '../types-and-interfaces/model-to-elements';
import { partial } from '../../core';
import { Observable } from 'rxjs/index';
import { ModelToString } from '../types-and-interfaces/model-to-string';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { applyModifiers } from './apply-modifiers';

export function elementMap(getElement: (name: string) => ElementData | NodeElementData | null,
                           templateElement: TemplateElement,
                           node: NodeAsync<object>,
                           elementData: ElementData | NodeElementData | null,
                           modelMap: ModelMap = m => m,
                           usedViews: string[] = []): ModelToElement {
  const create = (node: NodeAsync<object>, modelMap: ModelMap) => {
    return elementMap(getElement, templateElement, node, elementData, modelMap as any, usedViews)
  };
  const getNode = () => {
    if (isNodeElementData(elementData)) {
      const childSelectors: string[] = elementData.createChildFrom(templateElement.attributes);
      // @ts-ignore-line
      return node.createChild(data.actionMapOrActionMaps, ...childSelectors);
    }
    return node;
  };
  const createChild: any = (childElement: TemplateElement) => {
    const childData: ElementData | null = getElement(childElement.name);
    return applyModifiers(create, getNode, createChild, childElement, childData);
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
  //Any InsertContentAt in the TemplateElement.content will have been replaced by this time.
  let content: Array<TemplateElement | ModelToString> = templateElement.content as Array<TemplateElement | ModelToString>;
  if (elementData) {
    content = insertContentInView(elementData.content, content);
  }
  const contentMaps: Array<ModelToElementOrNull | ModelToString | ModelToElements> = content.map(
    (child) => {
      if (typeof child === 'function') {
        return child;
      }
      const childData: ElementData | null = getElement(child.name);

      if (elementData) {
        if (!elementData.templateValidator(templateElement.attributes)) {
          // just throwing for now until we have decided on how we should handle errors.
          throw new Error('missing or invalid required property for \'' + elementData.name + '\'');
        }
      }
      return applyModifiers(create, getNode, createChild, child, childData);
    }
  );

  let streamSelector: EventStreamManager;
  let stream = null;
  if (elementData) {
    if (isNodeElementData(elementData)) {
      streamSelector = new EventStreamManager();
      node.next(elementData.actions(streamSelector));
    } else {
      if (elementData.events) {
        streamSelector = new EventStreamManager();
        stream = elementData.events(streamSelector);
      } else {
        stream = new Observable<ViewEvent>();
      }
    }
  }
  const createElement = partial(toElement, templateElement.name, templateElement.attributes, contentMaps, stream);
  return (m: object) => {
    const result = createElement(m, modelMap);
    if (streamSelector) {
      return streamSelector.process(result);
    }
    return result;
  };
}
