import {EventStreams} from './event-streams';
import {TemplateElement} from './template-element';
import {Observable} from 'rxjs/Observable';
import {flatten} from './functions/flatten';
import {Dict} from './types-and-interfaces/dict';
import {ViewEvent} from './types-and-interfaces/view-event';
import {Subject} from 'rxjs/Subject';
import {dictToArray} from './functions/dict-to-array';
import {replaceChildWithId} from './functions/replace-child-with-id';

export class EventStreamSelector implements EventStreams {
  private selectable: Dict<TemplateElement>;

  constructor(private template: TemplateElement) {
    this.selectable = flatten([template]).filter(
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
      const handlers = template.eventsHandlers || [];
      const newTemplate = {...template};
      handlers.push(
        {
          for: type,
          handler
        }
      );
      newTemplate.eventsHandlers = handlers;
      this.selectable[id] = newTemplate;
    }
    return o;
  }

  public getEventTemplate(): TemplateElement {
    return dictToArray(this.selectable).reduce(
      (template: TemplateElement, child: TemplateElement) => {
        return replaceChildWithId(template, child);
      }, this.template);

  }
}
