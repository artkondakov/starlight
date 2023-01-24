import Watcher from './watcher';

class ConsentWatcher extends Watcher {
  constructor(props) {
    super(props);

    this.consentGiven = this.consentGiven.bind(this);
    this.getDataFromConsentLib = this.getDataFromConsentLib.bind(this);

    this.consentAgreed = this.getDataFromConsentLib();
    this.consentGivenTime = null;
  }

  start() {
    if (!this.consentAgreed) {
      addEventListener('cl-has-cookie', this.consentGiven, false);
      addEventListener('cl-new-cookie', this.consentGiven, false);
    } else this.consentGiven();

    this.emit('change', { consentAgreed: this.consentAgreed });
  }

  getDataFromConsentLib() {
    const rawData = window.consentData?.getUserInfo(window.consentData?.getConfig()) || {};
    return rawData.userAgree?.default;
  }

  consentGiven() {
    this.consentGivenTime = Date.now();
    this.consentAgreed = true;
    removeEventListener('cl-has-cookie', this.consentGiven);
    removeEventListener('cl-new-cookie', this.consentGiven);
    this.emit('change', { consentAgreed: this.consentAgreed });
    this.emit('timeChange', { timeoutAfterAgreeConsent: this.consentGivenTime });
  }

  stop() {
    removeEventListener('cl-has-cookie', this.consentGiven);
    removeEventListener('cl-new-cookie', this.consentGiven);
  }
}

export default ConsentWatcher;
