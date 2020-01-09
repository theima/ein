import { ViewTemplate } from './view-template';

export interface CustomViewTemplate extends ViewTemplate {
  children: any;
  type?: string;
}
