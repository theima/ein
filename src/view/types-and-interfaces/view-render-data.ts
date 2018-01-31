import {Property} from './property';
import {TemplateElement} from './template-element';
import {TemplateString} from './template-string';
import {DynamicProperty} from './dynamic-property';
import {ModelMap} from './model-map';
import {TemplateValidator} from './template-validator';
import { EventHandler } from './event-handler';
import { ViewEvent } from './view-event';
import { Observable } from 'rxjs/Observable';
import { RenderData } from './render-data';

export interface ViewRenderData extends RenderData{
  modelMap: ModelMap;
  templateValidator: TemplateValidator;
  eventHandlers?: EventHandler[];
  eventStream?: Observable<ViewEvent>;
}
