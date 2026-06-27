// FreeClaw - Code block fold / unfold
const CodeFolder = {
    _observer: null,
    _boundBlocks: new WeakSet(),

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

    _bindAll: function() {
        const self = this;
        document.querySelectorAll('.md-code-block').forEach(function(block) {
            if (self._boundBlocks.has(block)) return;
            self._boundBlocks.add(block);
            const banner = block.querySelector('.md-code-block-banner');
            if (!banner) return;
            banner.style.cursor = 'pointer';
            banner.addEventListener('click', function(e) {
                e.stopPropagation();
                const pre = block.querySelector('pre');
                if (!pre) return;
                if (pre.style.display === 'none') {
                    pre.style.display = '';
                } else {
                    pre.style.display = 'none';
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