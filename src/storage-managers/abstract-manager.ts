class AbstractStorageManager{
  $storage: Storage;
  constructor(storage: Storage) {
    this.$storage = storage;
  }

  set(key: string, value: string | number | boolean, expires: number | null = null) {
    return expires ? this.$setWithExpires(key, value, expires) : this.$storage.setItem(key, value.toString());
  }

  increment(key: string, expires = null) {
    const currentValue = parseInt(this.get(key), 10);
    const newValue: number = currentValue ? currentValue + 1 : 1;
    expires ? this.$setWithExpires(key, newValue, expires) : this.$storage.setItem(key, newValue.toString());
    return newValue;
  }

  private $setWithExpires(key: string, value: string | number | boolean, expires: number | string) {
    let expiresDate = null;
    if (expires) {
      expiresDate = new Date(Date.now() + parseInt(expires as string, 10));
    }
    const fromStorage = this.$getWithExpires(key);
    const newExpires = expiresDate || fromStorage?.expires;
    const dataToSave = {
      value,
      ...newExpires ? { expires: newExpires } : {},
    };
    return this.$storage.setItem(key, JSON.stringify(dataToSave));
  }

  get(key: string) {
    const fromStorage = this.$getWithExpires(key);
    if (!fromStorage) return null;
    if (typeof fromStorage === 'object' && fromStorage.expires) {
      if (new Date(fromStorage.expires) >= new Date()) {
        return fromStorage.value;
      } else {
        this.remove(key);
        return undefined;
      }
    }
    return fromStorage;
  }

  private $getWithExpires(key: string) {
    let fromStorage = this.$storage.getItem(key);
    if (fromStorage) {
      try {
        const parsed = JSON.parse(fromStorage);
        if (typeof parsed === 'object' && parsed.hasOwnProperty('value') && parsed.hasOwnProperty('expires')) {
          return parsed;
        } else {
          return fromStorage;
        }
      } catch {
        return fromStorage;
      }
    }
    return undefined;
  }

  remove(key: string) {
    return this.$storage.removeItem(key);
  }
};

export default AbstractStorageManager;
