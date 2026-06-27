// FreeClaw - Send Files Button
const SendFilesBtn = {
    _btn: null,

    init: function() {
        if (document.getElementById('ai-send-files-btn')) return;

        this._btn = document.createElement('button');
        this._btn.id = 'ai-send-files-btn';
        this._btn.textContent = '📋';
        this._btn.title = 'FreeClaw - Send Files';
        this._btn.onclick = function() { SendDialog.show(); };
        document.body.appendChild(this._btn);
    },

    show: function() {
        if (this._btn) this._btn.style.display = 'flex';
    },

    hide: function() {
        if (this._btn) this._btn.style.display = 'none';
    }
};