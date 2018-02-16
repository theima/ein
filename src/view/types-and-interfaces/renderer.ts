import { RenderData } from './render-data';
import { EmceAsync } from 'emce-async';

export type Renderer<T> = (e: T, emce: EmceAsync<any>, data: RenderData) => void;
