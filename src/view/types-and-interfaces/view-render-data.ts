import { RenderData } from './render-data';
import { Observable } from 'rxjs/Observable';
import { ViewEvent } from './view-event';
import { ModelToString } from './model-to-string';
import { ModelMap } from './model.map';

export interface ViewRenderData extends RenderData {
  modelMap: ModelMap;
  template: Array<RenderData | ModelToString>;
  eventStream?: Observable<ViewEvent>;
}
