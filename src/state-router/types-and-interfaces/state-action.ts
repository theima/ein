export enum StateAction {
  InitiateTransition = 'EinInitiateTransition',
  Transition = 'EinRouterTransition',
  Transitioning = 'EinRouterTransitioning',
  Transitioned = 'EinRouterTransitioned',
  TransitionPrevented = 'EinRouterTransitionPrevented',
  TransitionFailed = 'EinRouterTransitionFailed'
}
