import ConsentWatcher from './consent';

describe('ConsentWatcher class', () => {
  let watcher;
  beforeEach(() => {
    watcher = new ConsentWatcher();
  });

  describe('start', () => {
    it('adding event listeners', () => {
      global.window.consentData = {
        getConfig: jest.fn(),
        getUserInfo: jest.fn(() => ({
          userAgree: { default: false },
          is_fraud: null,
          is_eu: null,
          is_bot: null,
        })),
      };
      addEventListener = jest.fn();
      watcher.start();
      expect(addEventListener).toBeCalledTimes(2);
    });
  });

  describe('getDataFromConsentLib', () => {
    it('should parse consent data', () => {
      global.window.consentData = {
        getConfig: jest.fn(),
        getUserInfo: jest.fn(() => ({
          userAgree: { default: false },
          is_fraud: false,
          is_eu: true,
          is_bot: false,
        })),
      };
  
      expect(watcher.getDataFromConsentLib()).toBe(false);
    });
  });

  describe('consentGiven', () => {
    it('should return consent data with agreed flag and timestamp', () => {
      watcher.emit = jest.fn();
      watcher.consentGiven();
      expect(watcher.consentAgreed).toBe(true);
      expect(watcher.consentGivenTime).toBeLessThanOrEqual(Date.now());
      expect(watcher.emit).toBeCalled();
    });
  });
});
