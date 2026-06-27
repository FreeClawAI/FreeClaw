// FreeClaw - User message fold / unfold
const UserFolder = {
    _observer: null,
    _boundMessages: new WeakSet(),

    _selectors: [
        '[class*="_9663006"]',
        '[data-message-author-role="user"]',
        '[data-message-role="user"]',
        '.user-message',
        '[class*="human"]',
        '[class*="user"]'
    ],

    start: function() {
        if (this._observer) return;
        this._bindAll();
        this._observer = new MutationObserver(() => {
            this._bindAll();
        });
        this._observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    },

    _findUserMessages: function() {
        for (let i = 0; i < this._selectors.length; i++) {
            const els = document.querySelectorAll(this._selectors[i]);
            if (els.length > 0) return els;
        }
        return [];
    },

    _bindAll: function() {
        const self = this;
        const messages = this._findUserMessages();
        messages.forEach(function(msg) {
            if (self._boundMessages.has(msg)) return;
            self._boundMessages.add(msg);
            msg.style.cursor = 'pointer';
            msg.addEventListener('click', function(e) {
                const content = msg.querySelector('.fbb737a4')
                    || msg.querySelector('[class*="content"]')
                    || msg.querySelector('[class*="message"]')
                    || msg.querySelector('p, div');
                if (!content || content === msg) return;
                e.stopPropagation();
                if (content.style.display === 'none') {
                    content.style.display = '';
                    msg.style.opacity = '1';
                } else {
                    content.style.display = 'none';
                    msg.style.opacity = '0.5';
                }
            });
        });
    },

    stop: function() {
        if (this._observer) {
            this._observer.disconnect();
            this._observer = null;
        }
    }
};