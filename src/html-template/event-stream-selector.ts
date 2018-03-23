import { EventStreams } from '../view/event-streams';
import { Observable } from 'rxjs/Observable';
import { elementList } from '../view/functions/template-list';
import { ViewEvent } from '../view/types-and-interfaces/view-event';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/filter';
import { dictToArray, Dict } from '../core/index';
import { replaceContentItemWithId } from '../view/functions/replace-child-with-id';
import { getElements } from '../view/functions/get-elements';
import { RenderData } from '../view/types-and-interfaces/render-data';
import { ModelToString } from '../view/types-and-interfaces/model-to-string';

export class EventStreamSelector implements EventStreams {
  private selectable: Dict<RenderData>;

  constructor(private data: Array<RenderData | ModelToString>) {
    this.selectable = elementList(getElements(data as Array<RenderData | ModelToString>)).filter(
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

  public getData(): Array<RenderData | ModelToString> {
    let selected: RenderData[] = dictToArray(this.selectable);
    const templates = this.data.reduce((all: Array<RenderData | ModelToString>, item: RenderData | ModelToString) => {
      if (typeof item === 'object') {
        selected = selected.reduce((rem: RenderData[], s) => {
          const newTemplate = replaceContentItemWithId(item as RenderData, s) as RenderData;
          if (newTemplate === item) {
            rem.push(s);
          }
          item = newTemplate;
          return rem;
        }, []);
      }
      all.push(item);
      return all;
    }, []);
    return templates;
  }
}
