import { LocalStorageManager } from '../storage-managers';
import {
  POPUP_WAS_DISMISSED,
} from '../constants';

export const setVisibleForForced = (popups: any[], forced: number[] = []) => {
  return popups.map((el) => ({
    ...el,
    isVisible: forced.includes(el.id as number),
  }));
}

export const removeDismissed = (popups: any[], forced: any[] = []) => {
  // Remove popups which were dismissed but keep them anyway if they are in forced list
  return popups.filter((p) => {
    return (!LocalStorageManager.get(`${POPUP_WAS_DISMISSED}${p.id}`)) || forced.includes(p.id);
  });
}

export const getStorageAccessPermission = () => {
  // Check access for Local and Sesion storage in webkit
  return new Promise<void>((resolve, reject) => {
    // for non-webkit browsers
    if (!(typeof document.hasStorageAccess === 'function' && typeof document.requestStorageAccess === 'function')) {
      resolve();
      return;
    }

    function checkAccess() {
      return new Promise(() => {
        document.hasStorageAccess().then(
          function (hasAccess) {
            if (hasAccess) {
              // console.info('Has storage access');
              resolve();
              return;
            }
            return requestAccess();
          },
          function () {
            return requestAccess();
          }
        );
      });
    }

    function requestAccess() {
      return new Promise(() => {
        document.requestStorageAccess().then(
          function () {
            // console.info('Storage access granted');
            resolve();
          },
          function () {
            reject();
          }
        );
      });
    }

    return checkAccess();
  });
}

export const setContentInaccessible = (selector: string) => {
  document.querySelector(selector)?.setAttribute('aria-hidden', 'true');
  document.querySelector(selector)?.setAttribute('tabindex', '-1');
}

export const restoreContentAccessibility = (selector: string) => {
  document.querySelector(selector)?.removeAttribute('aria-hidden');
  document.querySelector(selector)?.removeAttribute('tabindex');
}
