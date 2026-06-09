// In-battle tutorial overlay. Shows once on the player's first battle unless skipped.

const TUTORIAL_KEY = 'return_battle_tutorial_seen';

const SLIDES = [
    {
        image: '../Assets/Sprites/tutorial/tut_Player.png',
        title: 'Your Character',
        desc: 'You are Edrick, the fallen knight. Your Health (red bar) and Stamina (yellow bar) are shown above you. Manage them wisely — when Stamina reaches zero, you cannot play cards.'
    },
    {
        image: '../Assets/Sprites/tutorial/tut_Enemy.png',
        title: 'Enemy Encounter',
        desc: 'Each room spawns 1–3 enemies. They attack one by one during their turn. Watch their poses — an attack stance means a parry is coming, while a defend stance raises their guard.'
    },
    {
        image: '../Assets/Sprites/tutorial/tut_Attack.png',
        title: 'Playing Cards',
        desc: "On your turn, click a card to select it, then click an enemy to strike. Attack cards cost Stamina. Physical attacks scale with Strength; Magic attacks scale with Intelligence. Match your cards to the enemy's weaknesses."
    },
    {
        image: '../Assets/Sprites/tutorial/tut_parryBar.png',
        title: 'The Parry Bar',
        desc: 'When an enemy attacks, the Parry Bar appears. Click when the icon is inside the green zone for a Perfect Parry (no damage + stamina gain), or the yellow zone for a Normal Parry (reduced damage). A Miss costs you health and stamina.'
    },
    {
        image: '../Assets/Sprites/tutorial/tut_Potion.png',
        title: 'Healing & Potions',
        desc: 'Your equipped potion can be used once per battle — click it to restore health or stamina instantly. Healing cards also mend your wounds and scale with Vigor. Use them before it is too late.'
    }
];

class BattleTutorial {
    constructor() {
        this.overlay = null;
        this.imgEl = null;
        this.titleEl = null;
        this.descEl = null;
        this.dotsEl = null;
        this.skipEl = null;
        this.counterEl = null;
        this.current = 0;
        this.active = false;
        this.onClose = null;
        this._onKey = this._onKey.bind(this);
        this.buildDOM();
    }

    buildDOM() {
        this.overlay = document.getElementById('battle-tutorial-overlay');
        if (!this.overlay) return;

        this.imgEl = document.getElementById('battle-tutorial-img');
        this.titleEl = document.getElementById('battle-tutorial-title');
        this.descEl = document.getElementById('battle-tutorial-desc');
        this.dotsEl = document.getElementById('battle-tutorial-dots');
        this.skipEl = document.getElementById('battle-tutorial-skip');
        this.counterEl = document.getElementById('battle-tutorial-counter');

        const prevBtn = this.overlay.querySelector('.battle-tutorial-prev');
        const nextBtn = this.overlay.querySelector('.battle-tutorial-next');
        const quitBtn = this.overlay.querySelector('.battle-tutorial-quit');

        if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
        if (nextBtn) nextBtn.addEventListener('click', () => this.next());
        if (quitBtn) quitBtn.addEventListener('click', () => this.quit());

        if (this.dotsEl) {
            this.dotsEl.innerHTML = '';
            SLIDES.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.className = 'battle-tutorial-dot';
                dot.setAttribute('aria-label', `Slide ${i + 1}`);
                dot.addEventListener('click', () => this.goTo(i));
                this.dotsEl.appendChild(dot);
            });
        }

        document.addEventListener('keydown', this._onKey);
    }

    _onKey(e) {
        if (!this.active) return;
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
        if (e.key === 'Escape') this.quit();
    }

    shouldShow() {
        return !localStorage.getItem(TUTORIAL_KEY);
    }

    show(onClose) {
        if (!this.overlay) return;
        this.onClose = onClose || null;
        this.current = 0;
        if (this.skipEl) this.skipEl.checked = false;
        this.active = true;
        this.overlay.classList.remove('hidden');
        this.render();
    }

    hide() {
        if (!this.overlay) return;
        this.active = false;
        this.overlay.classList.add('hidden');
    }

    quit() {
        if (this.skipEl && this.skipEl.checked) {
            localStorage.setItem(TUTORIAL_KEY, '1');
        }
        this.hide();
        if (typeof this.onClose === 'function') this.onClose();
    }

    goTo(index) {
        this.current = (index + SLIDES.length) % SLIDES.length;
        this.render();
    }

    next() { this.goTo(this.current + 1); }
    prev() { this.goTo(this.current - 1); }

    render() {
        const slide = SLIDES[this.current];
        if (this.imgEl) {
            this.imgEl.src = slide.image;
            this.imgEl.alt = slide.title;
        }
        if (this.titleEl) this.titleEl.textContent = slide.title;
        if (this.descEl) this.descEl.textContent = slide.desc;
        if (this.counterEl) this.counterEl.textContent = `${this.current + 1} / ${SLIDES.length}`;

        const dots = this.dotsEl ? this.dotsEl.querySelectorAll('.battle-tutorial-dot') : [];
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.current);
        });

        const prevBtn = this.overlay.querySelector('.battle-tutorial-prev');
        const nextBtn = this.overlay.querySelector('.battle-tutorial-next');
        if (prevBtn) prevBtn.disabled = this.current === 0;
        if (nextBtn) nextBtn.disabled = this.current === SLIDES.length - 1;
    }

    destroy() {
        this.hide();
        this.onClose = null;
        document.removeEventListener('keydown', this._onKey);
    }
}

export default new BattleTutorial();
