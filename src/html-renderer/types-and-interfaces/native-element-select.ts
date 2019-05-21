import { NativeElementStreams } from './native-element-streams';

export type NativeElementSelect<T> = (selector: string) => NativeElementStreams<T>;
