import { OnPropertyUpdate } from '../on-property-update';

export interface ExtenderCallbacks {
  onUpdate: OnPropertyUpdate;
  onBeforeDestroy?: () => void;
}
