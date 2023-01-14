import { pushToDL } from '~/utils';
import { LocalStorageManager } from '~/storage-managers';
import { EXPERIMENT_STORAGE_KEY } from '~/constants';

function gtag() {
  pushToDL(arguments);
}

export const $_gtag = gtag;

export default {
  activate() {
    return gtag('event', 'optimize.activate');
  },

  getExperimentStatus(experimentID) {
    if (window.google_optimize) return window.google_optimize.get(experimentID);
    return null;
  },

  getExperimentResult(experimentID) {
    let result = null;
    gtag('event', 'optimize.callback', {
      name: experimentID,
      callback: (r) => { result = r },
    });
    return result;
  },

  saveExperimentResult(experimentID, experimentResult) {
    LocalStorageManager.set(`${EXPERIMENT_STORAGE_KEY}${experimentID}`, experimentResult);
  },

  loadExperimentResult(experimentID) {
    return LocalStorageManager.get(`${EXPERIMENT_STORAGE_KEY}${experimentID}`);
  }
};
