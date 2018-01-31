import { EventStreams } from './event-streams';
import { Observable } from 'rxjs/Observable';
import { elementList } from './functions/template-list';
import { Dict } from '../core/types-and-interfaces/dict';
import { ViewEvent } from './types-and-interfaces/view-event';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/filter';
import { dictToArray } from '../core/functions/dict-to-array';
import { replaceChildWithId } from './functions/replace-child-with-id';
import { getElements } from './functions/get-elements';
import { TemplateString } from './types-and-interfaces/template-string';
import { ViewRenderData } from './types-and-interfaces/view-render-data';
import { RenderData } from './types-and-interfaces/render-data';

export class EventStreamSelector implements EventStreams {
  private selectable: Dict<ViewRenderData>;

  constructor(private data: Array<ViewRenderData | TemplateString>) {
    this.selectable = elementList(getElements(data as Array<RenderData | TemplateString>)).filter(
      (elm: RenderData) => {
        return !!elm.id;
      }
    ).reduce(
      (d: Dict<ViewRenderData>, elm: RenderData) => {
        const key: string = elm.id as string;
        d[key] = elm as ViewRenderData;
        return d;
      }, {}
    );
  }

  public select(id: string, type: string): Observable<ViewEvent> {
    const o: Subject<ViewEvent> = new Subject<ViewEvent>();
    const template: ViewRenderData | undefined = this.selectable[id];
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

  public getData(): Array<ViewRenderData | string> {
    let selected: ViewRenderData[] = dictToArray(this.selectable);
    const templates = this.data.reduce((all: Array<ViewRenderData | TemplateString>, template: ViewRenderData | TemplateString) => {
      if (typeof template !== 'string') {
        selected = selected.reduce((rem: ViewRenderData[], s) => {
          const newTemplate = replaceChildWithId(template as RenderData, s) as ViewRenderData;
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
