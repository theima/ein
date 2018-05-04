import { RenderInfo } from '../types-and-interfaces/render-info';
import { Property } from '..';

export function getProperty(info: RenderInfo, propertyName: string): Property | null {
  return info.properties.find(p => p.name === propertyName) || null;
}
