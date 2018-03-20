import { RenderData } from './render-data';
import { EmceAsync } from 'emce-async';
import { Property } from '../types-and-interfaces/property';

export type ModelToRendererCreator<T> = (emce: EmceAsync<any>,
                                         renderData: RenderData,
                                         elementMaps: Array<(m: object) => T | string>,
                                         propertyMaps: Array<(m: object) => Property>) => (m: object) => T;
