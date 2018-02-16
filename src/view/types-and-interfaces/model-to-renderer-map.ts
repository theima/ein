import { RenderData } from './render-data';
import { EmceAsync } from 'emce-async';
import { ForRenderer } from './for-renderer';

export type ModelToRendererMap<T> = (forRenderer: ForRenderer<T>,
                                     data: RenderData,
                                     emce: EmceAsync<object>) => (model: object) => T;
