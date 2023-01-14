/* eslint-disable import/prefer-default-export, camelcase, no-restricted-globals, class-methods-use-this */
import { parseQueryParams, getUTMMediumSource } from '../utils';
import { TICK_INTERVAL, UTM_SOURCE_QUERY_PARAM, UTM_MEDIUM_QUERY_PARAM } from '../constants';
import plugins from './registry';

interface RulesWatcherData {
  urls: string;
  excludeUrls: string;
  source: string;
  scroll: number;
  pageNumber: number;
  timeoutAfterAgreeConsent: number;
  sessionNumber?: number;
  goingToCloseWindow?: boolean;
  windowHasFocus?: boolean;
  userIsInactiveFor?: number;
  initialRouteData?: any;
  delayForSession?: number;
  delayForPage?: number;
}

interface RulesWatcherTimestamps {
  delayForSession?: number;
  delayForPage?: number;
}

class RulesWatcher {
  data: RulesWatcherData;
  timeRelated: RulesWatcherTimestamps;
  onChange: (data: RulesWatcherData) => void;
  tickInterval: NodeJS.Timeout;
  watchers!: any[];

  constructor(callback: (data: RulesWatcherData) => void) {
    this.onChange = callback;
    this.data = {
      urls: '',
      excludeUrls: '',
      source: '',
      scroll: 0,
      pageNumber: 1,
      timeoutAfterAgreeConsent: 0,
      delayForSession: 0,
      delayForPage: 0,
    };
    this.timeRelated = {
      delayForSession: 0,
      delayForPage: 0
    };


    this.tick = this.tick.bind(this);
    this.collectData = this.collectData.bind(this);
    this.timeChangeHandler = this.timeChangeHandler.bind(this);
    this.dataUpdated = this.dataUpdated.bind(this);

    this.tickInterval = setInterval(this.tick, TICK_INTERVAL);

    if (plugins.length) {
      this.watchers = [...plugins].filter(p => p.name && p.watcher).map(plugin => {
        const watcher = new plugin.watcher();
        watcher.on('change', this.dataUpdated);
        watcher.on('timeChange', this.timeChangeHandler);
        watcher.start();
        return watcher;
      });
    }

    const queryParams = parseQueryParams(window.location.search);
    const source = queryParams[UTM_SOURCE_QUERY_PARAM as keyof typeof queryParams];
    const medium = queryParams[UTM_MEDIUM_QUERY_PARAM as keyof typeof queryParams];

    if (medium || source) {
      const mediumSource = getUTMMediumSource(medium);
      const sourceSource = getUTMMediumSource(source);
      this.data.source = mediumSource || sourceSource;
    }

    this.collectData();
  }

  dataUpdated(newData: any) {
    this.data = { ...this.data, ...newData };
    this.collectData();
  }

  timeChangeHandler(timeFields: any) {
    this.timeRelated = { ...this.timeRelated, ...timeFields };
  }

  tick() {
    const now = Date.now();
    Object.keys(this.timeRelated).forEach((key: string) => {
      // @ts-ignore
      this.data[key as keyof RulesWatcherData] = Math.floor((now - this.timeRelated[key as keyof RulesWatcherTimestamps]) / 1000);
    });
    this.collectData();
  }

  collectData() {
    const { data } = this;
    this.onChange(data);
  }

  stop() {
    if (this.tickInterval) clearInterval(this.tickInterval);
    this.watchers.forEach(watcher => {
      watcher.stop();
    });
  }
}

export default RulesWatcher;
