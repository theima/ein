import { Property } from '../../view/types-and-interfaces/property';

export type UpdateElement = (newValue: object | string | number | boolean | null,
                             oldValue: object | string | number | boolean | null | undefined,
                             properties: Property[]) => void;
