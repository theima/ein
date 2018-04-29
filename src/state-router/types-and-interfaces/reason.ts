export enum Reason {
  NoStateName = 'No state name given',
  NoState = 'State does not exist',
  CouldNotLoadData = 'Failed to retrieve state data',
  CouldNotBuildUrl = 'Could not create url',
  NoPathMap = 'No path map',
  NoStateForLocation = 'Could not find state for url',
  CanLeaveFailed = 'Could not complete canLeave',
  CanEnterFailed = 'Could not complete canEnter',
  CouldNotCreateTitle = 'Could not set title for state'
}
