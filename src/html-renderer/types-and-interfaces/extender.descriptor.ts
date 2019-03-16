export interface ExtenderDescriptor {
  name: string;
  extender: (element: Element) => void;
}
