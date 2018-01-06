export interface RenderedElement {
  tag: string;
  children: Array<RenderedElement | string>;
  events?: Array<{
    name: string;
    handler: () => void;
  }>;
}
