import {EventStreams} from './event-streams';
import {TemplateElement} from './types-and-interfaces/template-element';
import {Observable} from 'rxjs/Observable';
import {templateList} from './functions/template-list';
import {Dict} from './types-and-interfaces/dict';
import {ViewEvent} from './types-and-interfaces/view-event';
import {Subject} from 'rxjs/Subject';
import {dictToArray} from './functions/dict-to-array';
import {replaceChildWithId} from './functions/replace-child-with-id';
import {getTemplateElements} from './functions/get-template-elements';
import {TemplateString} from './types-and-interfaces/template-string';
import {DynamicAttribute} from './types-and-interfaces/dynamic-attribute';
import {Attribute} from './types-and-interfaces/attribute';
import {EventHandler} from './types-and-interfaces/event-handler';

export class EventStreamSelector implements EventStreams {
  private selectable: Dict<TemplateElement>;

  constructor(private templates: Array<TemplateElement | TemplateString>) {
    this.selectable = templateList(getTemplateElements(templates)).filter(
      (elm: TemplateElement) => {
        return !!elm.id;
      }
    ).reduce(
      (d: Dict<TemplateElement>, elm: TemplateElement) => {
        const key: string = elm.id as string;
        d[key] = elm;
        return d;
      }, {}
    );
  }

  public select(id: string, type: string): Observable<ViewEvent> {
    const o: Subject<ViewEvent> = new Subject<ViewEvent>();
    const template: TemplateElement | undefined = this.selectable[id];
    if (template) {
      const handler = (e: ViewEvent) => o.next(e);
      const handlers = template.eventHandlers || [];
      const newTemplate = {...template};
      handlers.push(
        {
          for: type,
          handler
        }
      );
      newTemplate.eventHandlers = handlers;
      this.selectable[id] = newTemplate;
    }
    return o;
  }

  public getEventTemplate(): Array<TemplateElement | string> {
    let selected: TemplateElement[] = dictToArray(this.selectable);
    const templates = this.templates.reduce((all: Array<TemplateElement | TemplateString>, template) => {
      if (typeof template !== 'string') {
        selected = selected.reduce((rem: TemplateElement[], s) => {
          const newTemplate = replaceChildWithId(template as TemplateElement, s);
          if (newTemplate === template) {
            rem.push(s);
          }
          template = newTemplate;
          return rem;
        }, []);
      }
      all.push(template);
      return all;
    }, []);
    return templates;
  }
}
