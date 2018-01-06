export interface TemplateElement {
  tag: string;
  children: Array<TemplateElement | string>;
  events?: Array<{
    name: string;
    handler: () => void;
  }>;
}
