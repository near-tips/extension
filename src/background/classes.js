import { LOCAL_STORAGE_KEY } from "../utils/constants";
import logger from '../utils/logger';

export class LocalStorage {
    _storage = {}

    constructor(storage) {
        this._storage = storage || {};
    }
    setItem(key, value) {
        this._storage[key] = value;

        chrome.storage.local.set({
            [LOCAL_STORAGE_KEY]: this._storage
        })
    }
    getItem(key) {
        logger.log({
            store: this._storage,
            key,
        })
        return this._storage[key] || null;
    }
    clear() {
        this._storage = {};

        chrome.storage.local.set({
            [LOCAL_STORAGE_KEY]: this._storage
        })
    }
    removeItem(key) {
        delete this._storage[key];

        chrome.storage.local.set({
            [LOCAL_STORAGE_KEY]: this._storage
        })
    }
    get length() {
        return Object.values(this._storage).length;
    }
}

export const Service = {
    stackOverflow: 'Stackoverflow',
}
