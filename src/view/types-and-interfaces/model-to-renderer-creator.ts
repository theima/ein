import { RenderData } from './render-data';
import { EmceAsync } from 'emce-async';

export type ModelToRendererCreator<T> = (emce: EmceAsync<any>,
                                         renderData: RenderData,
                                         elementMaps: Array<(m: object) => T | string>) => (m: object) => T;
