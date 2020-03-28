import { Dict, partial } from '../../../core';
import { TitleConfig } from '../../types-and-interfaces/config/title.config';
import { createSetTitle } from './create-set-title';
import { stateToTitle } from './state-to-title';
import { titleMiddleware } from './title.middleware';

export function initiateTitleMiddleware(paths: Dict<TitleConfig>) {
  return partial(titleMiddleware, partial(stateToTitle, paths), createSetTitle(document));
}
