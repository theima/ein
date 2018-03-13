import { EventStreams } from './event-streams';
import { Observable } from 'rxjs/Observable';
import { elementList } from './functions/template-list';
import { ViewEvent } from './types-and-interfaces/view-event';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/filter';
import { dictToArray, Dict } from '../core';
import { replaceContentItemWithId } from './functions/replace-child-with-id';
import { getElements } from './functions/get-elements';
import { TemplateString } from './types-and-interfaces/template-string';
import { RenderData } from './types-and-interfaces/render-data';

export class EventStreamSelector implements EventStreams {
  private selectable: Dict<RenderData>;

  constructor(private data: Array<RenderData | TemplateString>) {
    this.selectable = elementList(getElements(data as Array<RenderData | TemplateString>)).filter(
      (elm: RenderData) => {
        return !!elm.id;
      }
    ).reduce(
      (d: Dict<RenderData>, elm: RenderData) => {
        const key: string = elm.id as string;
        d[key] = elm as RenderData;
        return d;
      }, {}
    );
  }

  public select(id: string, type: string): Observable<ViewEvent> {
    const o: Subject<ViewEvent> = new Subject<ViewEvent>();
    const template: RenderData | undefined = this.selectable[id];
    if (template) {
      if (template.eventStream) {
        template.eventStream
          .filter(e => e.type === type)
          .subscribe(
            (e) => o.next(e)
          );
      } else {
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
    }
    return o;
  }

  public getData(): Array<RenderData | string> {
    let selected: RenderData[] = dictToArray(this.selectable);
    const templates = this.data.reduce((all: Array<RenderData | TemplateString>, template: RenderData | TemplateString) => {
      if (typeof template !== 'string') {
        selected = selected.reduce((rem: RenderData[], s) => {
          const newTemplate = replaceContentItemWithId(template as RenderData, s) as RenderData;
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
