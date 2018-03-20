import { EmceAsync } from 'emce-async';
import { VNode } from 'snabbdom/vnode';
import { RenderData, ModelToRendererCreator } from '../../view';

export type ModelToRendererMap = (forRenderer: ModelToRendererCreator<VNode | string>,
                                  data: RenderData,
                                  emce: EmceAsync<object>) => (model: object) => VNode | string;
