import AbstractStorageManager from './abstract-manager';

describe('Abstract storage manager', () => {
  describe('works with sessionStorage', () => {
    let SM;
    beforeEach(() => {
      SM = new AbstractStorageManager(sessionStorage);
    });

    it('applies sessionStorage', async () => {
      expect(SM.$storage instanceof Storage).toEqual(true);
    });

    it('can get by key', async () => {
      sessionStorage.setItem('key', 'value');
      expect(SM.get('key')).toEqual('value');
    });

    it('can set by key', async () => {
      SM.set('key', 'value');
      expect(sessionStorage.getItem('key')).toEqual('value');
    });

    it('can increment values', async () => {
      sessionStorage.setItem('key', 1);
      SM.increment('key');
      expect(parseInt(sessionStorage.getItem('key'), 10)).toEqual(2);
    });

    it('can increment empty values', async () => {
      SM.increment('otherKey');
      expect(parseInt(sessionStorage.getItem('otherKey'), 10)).toEqual(1);
    });
  });

  describe('works with localStorage', () => {
    let SM;
    beforeEach(() => {
      SM = new AbstractStorageManager(localStorage);
    });

    it('applies localStorage', async () => {
      expect(SM.$storage instanceof Storage).toEqual(true);
    });

    it('can get by key', async () => {
      localStorage.setItem('key', 'value');
      expect(SM.get('key')).toEqual('value');
    });

    it('can set by key', async () => {
      SM.set('key', 'value');
      expect(localStorage.getItem('key')).toEqual('value');
    });

    it('can increment values', async () => {
      localStorage.setItem('key', 1);
      SM.increment('key');
      expect(parseInt(localStorage.getItem('key'), 10)).toEqual(2);
    });

    it('can increment empty values', async () => {
      SM.increment('otherKey');
      expect(parseInt(localStorage.getItem('otherKey'), 10)).toEqual(1);
    });
  });

  describe('implements TTL', () => {
    let SM;
    beforeEach(() => {
      SM = new AbstractStorageManager(localStorage);
    });

    it('returns value if TTL is not expired', async () => {
      SM.set('ttl1', 'value', 1000 * 3600 * 24);
      expect(SM.get('ttl1')).toEqual('value');
    });

    it('returns null if TTL is expired', async () => {
      const timestamp = Date.now();
      Date.now = jest.fn().mockImplementation(() => {
        // two days earlier
        return timestamp - 1000 * 3600 * 24 * 2;
      });
      SM.set('ttl2', 'value', 1000 * 3600 * 24);
      expect(typeof SM.get('ttl2')).toEqual('undefined');
    });

    it('drops expires and updates value', async () => {
      SM.set('ttl3', 'value', 1000 * 3600 * 24);
      SM.set('ttl3', 'value2');
      expect(SM.$getWithExpires('ttl3')).toEqual('value2');
    });

    it('updates expires', async () => {
      const timestamp = Date.now();
      Date.now = jest.fn().mockImplementation(() => {
        // two days earlier
        return timestamp - 1000 * 3600 * 24 * 2;
      });
      SM.set('ttl4', 'value', 1000 * 3600 * 24);
      SM.set('ttl4', 'value2', 1000 * 3600 * 24 * 2);
      const firstGet = SM.$getWithExpires('ttl4');
      expect(new Date(firstGet.expires)).toEqual(new Date(timestamp));
      expect(firstGet.value).toEqual('value2');
    });

    it('sets 1 in increment if field expired', async () => {
      const timestamp = Date.now();
      Date.now = jest.fn().mockImplementation(() => {
        // two days earlier
        return timestamp - 1000 * 3600 * 24 * 2;
      });
      SM.set('ttl5', 10, 1000 * 3600 * 24);
      SM.increment('ttl5', 1000 * 3600 * 24 * 10);
      expect(SM.get('ttl5')).toEqual(1);
    });
  });
});
