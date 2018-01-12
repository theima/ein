import {TemplateElement} from '../types-and-interfaces/template-element';
import {fromTemplate} from './from-template';
import {Dict} from '../types-and-interfaces/dict';
import {ViewData} from '../types-and-interfaces/view-data';
import {EventStreamSelector} from '../event-stream-selector';
import {Element} from '../types-and-interfaces/element';
import {toSnabbdomNode} from './to-snabbdom-node';
import {Tag} from '../types-and-interfaces/tag';

export function createElementFromTemplate(dict: Dict<ViewData>): (e: TemplateElement) => (model: any) => Element {
  let elementFromTemplate: (e: TemplateElement,  tags?: string[]) => (model: any) => Element = (e: TemplateElement, tags: string[] = []) => {
    if (tags.indexOf(e.tag) !== -1) {
      // throwing for now.
      throw new Error('Cannot use element inside itself');
    }
    let custom: ViewData = dict[e.tag];
    if (custom) {
      if (custom.events) {
        const streams = new EventStreamSelector(custom.template);
        custom.events(streams);
        e = streams.getEventTemplate();
      } else {
        e = custom.template;
      }
    }
    let children: Array<(m: any) => Element | string> = e.children.map((c: TemplateElement | string) => {
      if (typeof c === 'string') {
        return fromTemplate(c);
      }
      return elementFromTemplate(c, [...tags, e.tag]);
    });
    return (m: any) => {
      let t: Tag = {
        name: e.tag
      };
      if (e.attributes) {
        t.attributes = e.attributes;
      }
      return toSnabbdomNode(t, children.map(c => c(m)), e.eventHandlers);
    };
  };
  return elementFromTemplate;
}
