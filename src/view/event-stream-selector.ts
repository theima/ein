import { EventStreams } from './types-and-interfaces/event-streams';
import { Observable } from 'rxjs/Observable';
import { getSubscribableRenderData } from './functions/get-subscribable-render-data';
import { ViewEvent } from './types-and-interfaces/view-event';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/filter';
import { dictToArray, Dict, arrayToDict } from '../core';
import { replaceChild } from './functions/replace-child';
import { getRenderData } from './functions/get-render-data';
import { RenderData } from './types-and-interfaces/render-data';
import { ModelToString } from './types-and-interfaces/model-to-string';
import { ViewRenderData } from './types-and-interfaces/view-render-data';

export class EventStreamSelector implements EventStreams {
  private selectable: Dict<RenderData>;

  constructor(private content: Array<RenderData | ModelToString>) {
    this.selectable = arrayToDict('id',
      getSubscribableRenderData(
        getRenderData(content)).filter(
        (elm: RenderData) => {
          return !!elm.id;
        }
      ));
  }

  public select(id: string, type: string): Observable<ViewEvent> {
    const o: Subject<ViewEvent> = new Subject<ViewEvent>();
    const template: RenderData | ViewRenderData | undefined = this.selectable[id];
    if (template) {
      const viewData = template as ViewRenderData;
      if (viewData.eventStream) {
        viewData.eventStream
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
    if (selected.length) {
      const templates = this.content.reduce((all: Array<RenderData | ModelToString>, item: RenderData | ModelToString) => {
        if (typeof item === 'object') {
          let remaining: RenderData[] = [];
          selected.forEach(
            (s) => {
              const newTemplate = replaceChild(item as RenderData, s) as RenderData;
              if (newTemplate === item) {
                remaining.push(s);
              }
              item = newTemplate;
            }
          );
          selected = remaining;
        }
        all.push(item);
        return all;
      }, []);
      return templates;
    }
    return this.content;
  }
}
