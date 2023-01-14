/* eslint-disable import/prefer-default-export */
import AbstractStorageManager from './abstract-manager';
import CM from './cookie-manager';

export const SessionStorageManager = new AbstractStorageManager(sessionStorage);
export const LocalStorageManager = new AbstractStorageManager(localStorage);
export const CookieManager = CM;