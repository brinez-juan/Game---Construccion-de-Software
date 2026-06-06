import * as GlobalVars from './GlobalVariables.js';

// Fade duration in milliseconds for crossfade transitions
const FADE_MS = 600;
const FADE_STEP_MS = 30;
//cd "C:\Users\paulo\OneDrive\Desktop\VideoJuego_mierda\Repo\Game---Construccion-de-Software"
//npm start

/**
 * MusicManager — central audio controller for Return.
 *
 * Design decisions:
 *  - Imports GlobalVariables as a namespace so musicEnabled is always the
 *    live value, not a snapshot captured at module load time.
 *  - All tracks are pre-built at construction; no Audio objects are created
 *    during gameplay to avoid GC hitches.
 *  - play() is idempotent: calling it with the current track is a no-op.
 *  - Crossfade smoothly fades out the old track while fading in the new one.
 *  - Autoplay is deferred: the first play() call is queued if the browser
 *    blocks it (autoplay policy), and fires on the next user interaction.
 */
class MusicManager {
    constructor() {
        /** @type {HTMLAudioElement|null} */
        this.currentTrack = null;
        this.currentKey   = '';

        /** @type {number} Master volume 0–1, independent of mute state. */
        this.volume = 0.7;

        /** @type {Map<string, HTMLAudioElement>} */
        this.tracks = new Map([
            ['battle', this._makeTrack('../Assets/Audio/batalla_musicaReturnDark.mp3')],
            ['boss',   this._makeTrack('../Assets/Audio/batalla_musicaReturnBossDark.mp3')],
            ['intro',  this._makeTrack('../Assets/Audio/Intro_muscaReturnDark.mp3')],
        ]);

        /** Stores the key requested while autoplay was blocked, so it can be
         *  replayed on the next user interaction. */
        this._pendingKey = '';

        // One-time listener: flush a pending play request after the user
        // interacts with the page (satisfies browser autoplay policy).
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

    // ─── Private helpers ──────────────────────────────────────────────────────

    /**
     * Creates a looping Audio element at the given path.
     * @param {string} src
     * @returns {HTMLAudioElement}
     */
    _makeTrack(src) {
        const audio = new Audio(src);
        audio.loop   = true;
        audio.volume = this.volume;
        return audio;
    }

    /**
     * Fades `audio` from `fromVol` to `toVol` over FADE_MS milliseconds.
     * Calls `onDone` when finished.
     * @param {HTMLAudioElement} audio
     * @param {number} fromVol
     * @param {number} toVol
     * @param {() => void} [onDone]
     */
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

    // ─── Public API ───────────────────────────────────────────────────────────

    /**
     * Plays the track identified by `key` ('intro', 'battle', 'boss').
     * - No-op if that track is already playing.
     * - Stops silently if music is disabled.
     * - Queues the request if the browser blocks autoplay.
     * @param {string} key
     */
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

    /**
     * Pauses the current track without resetting its position.
     * Use resume() to continue from where it stopped.
     */
    pause() {
        if (this.currentTrack && !this.currentTrack.paused) {
            this.currentTrack.pause();
        }
    }

    /**
     * Resumes the paused current track (respects mute state).
     */
    resume() {
        if (!GlobalVars.musicEnabled) return;
        if (this.currentTrack && this.currentTrack.paused) {
            this.currentTrack.play().catch(() => {});
        }
    }

    /**
     * Stops and resets all tracks immediately (no fade).
     */
    stopAll() {
        this.tracks.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        this.currentTrack = null;
        this.currentKey   = '';
    }

    /**
     * Sets master volume (0–1) for all tracks, including the current one.
     * @param {number} vol — clamped to [0, 1]
     */
    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        this.tracks.forEach(audio => { audio.volume = this.volume; });
    }

    /**
     * Called after GlobalVars.musicEnabled changes.
     * Stops playback if now disabled; resumes the last track if now enabled.
     */
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