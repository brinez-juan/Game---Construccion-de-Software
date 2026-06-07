import * as GlobalVars from './GlobalVariables.js';

// Fade duration in milliseconds for crossfade transitions
const FADE_MS = 600;
const FADE_STEP_MS = 30;
//cd "C:\Users\paulo\OneDrive\Desktop\VideoJuego_mierda\Repo\Game---Construccion-de-Software"
//npm start


class MusicManager {
    constructor() {
        this.currentTrack = null;
        this.currentKey   = '';
        this.volume = 0.7;
        this.tracks = new Map([
            ['battle', this._makeTrack('../Assets/Audio/batalla_musicaReturnDark.mp3')],
            ['boss',   this._makeTrack('../Assets/Audio/batalla_musicaReturnBossDark.mp3')],
            ['intro',  this._makeTrack('../Assets/Audio/Intro_muscaReturnDark.mp3')],
        ]);
        this._pendingKey = '';
        this._onUserGesture = () => {
            if (this._pendingKey) {
                const key = this._pendingKey;
                this._pendingKey = '';
                this.play(key);
            }
        };
        document.addEventListener('click',   this._onUserGesture, { once: true });
        document.addEventListener('keydown', this._onUserGesture, { once: true });
    }
    _makeTrack(src) {
        const audio = new Audio(src);
        audio.loop   = true;
        audio.volume = this.volume;
        return audio;
    }
    _fade(audio, fromVol, toVol, onDone) {
        const steps    = Math.round(FADE_MS / FADE_STEP_MS);
        const delta    = (toVol - fromVol) / steps;
        let   current  = fromVol;
        let   step     = 0;

        audio.volume = Math.max(0, Math.min(1, fromVol));

        const tick = setInterval(() => {
            step++;
            current += delta;
            audio.volume = Math.max(0, Math.min(1, current));

            if (step >= steps) {
                clearInterval(tick);
                audio.volume = Math.max(0, Math.min(1, toVol));
                if (onDone) onDone();
            }
        }, FADE_STEP_MS);
    }

    play(key) {
        if (!GlobalVars.musicEnabled) {
            this.stopAll();
            return;
        }

        // Already playing this track — nothing to do.
        if (key === this.currentKey && this.currentTrack && !this.currentTrack.paused) {
            return;
        }

        const next = this.tracks.get(key);
        if (!next) {
            console.warn(`MusicManager: unknown track key "${key}"`);
            return;
        }

        const prev = this.currentTrack;
        this.currentKey   = key;
        this.currentTrack = next;

        next.currentTime = 0;
        next.volume      = 0;

        // Fade out old track while fading in new one.
        if (prev && !prev.paused) {
            this._fade(prev, prev.volume, 0, () => {
                prev.pause();
                prev.currentTime = 0;
            });
        }

        next.play().then(() => {
            this._fade(next, 0, this.volume);
        }).catch(() => {
            // Autoplay blocked — store the key so the gesture listener retries.
            this._pendingKey = key;
            this.currentTrack = prev;    // roll back so state stays consistent
            this.currentKey   = prev ? this.currentKey : '';
        });
    }
    pause() {
        if (this.currentTrack && !this.currentTrack.paused) {
            this.currentTrack.pause();
        }
    }
    resume() {
        if (!GlobalVars.musicEnabled) return;
        if (this.currentTrack && this.currentTrack.paused) {
            this.currentTrack.play().catch(() => {});
        }
    }
    stopAll() {
        this.tracks.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        this.currentTrack = null;
        // Keep currentKey so refresh() knows what to resume when music is re-enabled.
    }
    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        this.tracks.forEach(audio => { audio.volume = this.volume; });
    }
    refresh() {
        if (!GlobalVars.musicEnabled) {
            this.stopAll();
        } else if (this.currentKey) {
            this.play(this.currentKey);
        }
    }
}

const musicManager = new MusicManager();
export default musicManager;