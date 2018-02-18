import { EmceAsync } from 'emce-async';
import { VNode } from 'snabbdom/vnode';
import { RenderData, ForRenderer } from '../../view';

export type ModelToRendererMap = (forRenderer: ForRenderer<VNode | string>,
                                  data: RenderData,
                                  emce: EmceAsync<object>) => (model: object) => VNode | string;
