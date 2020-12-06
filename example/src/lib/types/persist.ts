export interface StateStorage {
  getItem: (name: string) => string | null | Promise<string | null>;
  setItem: (name: string, value: string) => void | Promise<void>;
}

export interface PersistOptions<T> {
  name: string;
  storage?: StateStorage;
  serialize?: (state: T) => string | Promise<string>;
  deserialize?: (state: string) => T | Promise<T>;
}
