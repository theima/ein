import { Attribute } from '../../view/types-and-interfaces/attribute';

export type UpdateElement = (element: Element,
                             newValue: object | string | number | boolean | null,
                             oldValue: object | string | number | boolean | null | undefined,
                             attributes: Attribute[]) => void;
