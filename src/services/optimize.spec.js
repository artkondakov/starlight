import OptimizeService, { $_gtag } from './optimize';
import { EXPERIMENT_STORAGE_KEY } from '~/constants';

const push = jest.fn().mockImplementation(([e, n, payload]) => {
  payload?.callback?.('123');
});

global.dataLayer = {
  push
};

describe('Google Optimize service', () => {
  describe('gtag', () => {
    it('should call dataLayer', () => {
      $_gtag('event', 'eventName', { data: 123 });
      expect(push).toBeCalled();
      expect(push.mock.calls[0][0][0]).toBe('event');
      expect(push.mock.calls[0][0][1]).toBe('eventName');
      expect(push.mock.calls[0][0][2]).toEqual({ data: 123 });
    });
  });

  describe('activate', () => {
    it('should call activate event', () => {
      OptimizeService.activate();
      expect(push).toBeCalled();
      expect(push.mock.calls[1][0][0]).toBe('event');
      expect(push.mock.calls[1][0][1]).toBe('optimize.activate');
    });
  });

  describe('getExperimentStatus', () => {
    it('should return null if optimized not defined', () => {
      expect(OptimizeService.getExperimentStatus()).toBe(null);
    });

    it('should call optimize fn', () => {
      const getExperiment = jest.fn();
      global.google_optimize = {
        get: getExperiment,
      };
      OptimizeService.getExperimentStatus();
      expect(getExperiment).toBeCalled();
    });
  });

  describe('getExperimentResult', () => {
    it('should call optimize fn', () => {
      expect(OptimizeService.getExperimentResult('qwerty100500')).toBe('123');
    });
  });

  describe('saveExperimentResult', () => {
    beforeEach(() => {
      jest.spyOn(Storage.prototype, 'setItem')
    });

    it('should save result to localStorage', () => {
      OptimizeService.saveExperimentResult('qwerty123', '123');
      expect(localStorage.setItem).toHaveBeenCalledWith(`${EXPERIMENT_STORAGE_KEY}qwerty123`, '123');
    });
  });

  describe('loadExperimentResult', () => {
    beforeEach(() => {
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        return '456';
      });
    });

    it('should return result from localStorage', () => {
      expect(OptimizeService.loadExperimentResult('qwerty456')).toBe('456');
    });
  });
});