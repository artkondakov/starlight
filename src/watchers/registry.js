/* eslint-disable import/prefer-default-export, camelcase, no-restricted-globals, class-methods-use-this */
import RouteWatcher from './route';
import SessionWatcher from './session';
import MouseWatcher from './mouse';

export default [
  {
    name: 'route',
    watcher: RouteWatcher,
  },
  {
    name: 'session',
    watcher: SessionWatcher,
  },
  {
    name: 'mouse',
    watcher: MouseWatcher,
  }
];
