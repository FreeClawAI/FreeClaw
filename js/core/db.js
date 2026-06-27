// IndexedDB wrapper for caching user files and state
const DB = {
    _db: null,

    async open() {
        if (this._db) return;
        return new Promise((resolve, reject) => {
            const req = indexedDB.open('freeclaw-db', 1);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('files')) db.createObjectStore('files', { keyPath: 'key' });
                if (!db.objectStoreNames.contains('templates')) db.createObjectStore('templates', { keyPath: 'id' });
                if (!db.objectStoreNames.contains('state')) db.createObjectStore('state', { keyPath: 'id' });
            };
            req.onsuccess = (e) => { this._db = e.target.result; resolve(); };
            req.onerror = () => reject(new Error('IndexedDB open failed'));
        });
    },

    _ensureDB() {
        if (!this._db) throw new Error('Database not opened');
    },

    _promiseTxn(txn) {
        return new Promise((resolve, reject) => {
            txn.oncomplete = () => resolve();
            txn.onerror = () => reject(txn.error || new Error('Transaction failed'));
        });
    },

    async saveFile(key, data) {
        this._ensureDB();
        const txn = this._db.transaction('files', 'readwrite');
        const store = txn.objectStore('files');
        store.put({ key, ...data, updatedAt: Date.now() });
        return this._promiseTxn(txn);
    },

    async getFile(key) {
        this._ensureDB();
        const store = this._db.transaction('files', 'readonly').objectStore('files');
        return new Promise((resolve) => {
            const req = store.get(key);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => resolve(null);
        });
    },

    async deleteFile(key) {
        this._ensureDB();
        const txn = this._db.transaction('files', 'readwrite');
        const store = txn.objectStore('files');
        store.delete(key);
        return this._promiseTxn(txn);
    },

    async getAllFiles() {
        this._ensureDB();
        const store = this._db.transaction('files', 'readonly').objectStore('files');
        return new Promise((resolve) => {
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => resolve([]);
        });
    },

    async saveState(state) {
        this._ensureDB();
        const txn = this._db.transaction('state', 'readwrite');
        const store = txn.objectStore('state');
        store.put({ id: 'lastState', ...state, updatedAt: Date.now() });
        return this._promiseTxn(txn);
    },

    async getState() {
        this._ensureDB();
        const store = this._db.transaction('state', 'readonly').objectStore('state');
        return new Promise((resolve) => {
            const req = store.get('lastState');
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => resolve(null);
        });
    },

    async saveTemplates(templates) {
        this._ensureDB();
        const txn = this._db.transaction('templates', 'readwrite');
        const store = txn.objectStore('templates');
        store.clear();
        templates.forEach(t => store.put(t));
        return this._promiseTxn(txn);
    },

    async getTemplates() {
        this._ensureDB();
        const store = this._db.transaction('templates', 'readonly').objectStore('templates');
        return new Promise((resolve) => {
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => resolve([]);
        });
    },

    async saveQuickMessages(messages) {
        this._ensureDB();
        const txn = this._db.transaction('files', 'readwrite');
        const store = txn.objectStore('files');
        store.put({ key: '__quick_msgs__', messages: messages, updatedAt: Date.now() });
        return this._promiseTxn(txn);
    },

    async getQuickMessages() {
        this._ensureDB();
        const store = this._db.transaction('files', 'readonly').objectStore('files');
        return new Promise((resolve) => {
            const req = store.get('__quick_msgs__');
            req.onsuccess = () => resolve(req.result ? req.result.messages : null);
            req.onerror = () => resolve(null);
        });
    }
};