import { RenderData } from './render-data';
import { VNode } from 'snabbdom/vnode';
import { EmceAsync } from 'emce-async';
import { ForRenderer } from './for-renderer';

export type ModelToRendererMap<T> = (forRenderer: ForRenderer<VNode | string>,
                                     data: RenderData,
                                     emce: EmceAsync<object>) => (model: object) => T;
