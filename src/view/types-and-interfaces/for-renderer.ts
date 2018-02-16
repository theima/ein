import { RenderData } from './render-data';
import { EmceAsync } from 'emce-async';
import { TemplateString } from './template-string';
import { Property } from '../index';

export type ForRenderer<T> = (emce: EmceAsync<any>,
                              renderData: RenderData,
                              elementMaps: Array<(m: object) => T | TemplateString>,
                              propertyMaps: Array<(m: object) => Property>) => (m: object) => T;
