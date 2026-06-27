// FreeClaw - Plugin configuration management
const Config = {
    _defaults: {
        serverUrl: 'http://localhost:18080',
        workDirs: [],
        lastSaveDir: '',
        formatTabWidth: 4
    },
    _data: {},

    async load() {
        try {
            const result = await chrome.storage.local.get('fcConfig');
            this._data = Object.assign({}, this._defaults, result.fcConfig || {});
        } catch (e) {
            console.error('FreeClaw: Failed to load config', e);
            this._data = Object.assign({}, this._defaults);
        }
    },

    async save() {
        await chrome.storage.local.set({ fcConfig: this._data });
    },

    get serverUrl() {
        return this._data.serverUrl || 'http://localhost:18080';
    },

    set serverUrl(v) {
        this._data.serverUrl = v;
        this.save();
    },

    get workDirs() {
        return this._data.workDirs || [];
    },

    set workDirs(v) {
        this._data.workDirs = v;
        this.save();
    },

    get mainDir() {
        const dirs = this._data.workDirs || [];
        return dirs[0] || 'workspace';
    },

    get lastSaveDir() {
        return this._data.lastSaveDir || this.mainDir;
    },

    set lastSaveDir(v) {
        this._data.lastSaveDir = v;
        this.save();
    }
};