"use strict";

// Central audio singleton that manages music tracks and SFX.
// All paths are relative to WebPage/pages/game.html.

const AUDIO_PATH = '../Assets/Audio/';

const MUSIC_TRACKS = {
    intro:    'Intro_musicaReturn.mp3',
    battle:   'batalla_musicaReturn.mp3',
    lobby:    'Lobby_musicaReturn.mp3',
    map:      'Intro_musicaReturnDark.mp3',
    gameover: 'Intro_muscaReturnDark.mp3',
    victory:  'Intro_musicaReturn.mp3',
    credits:  'Lobby_musicaReturn1.mp3',
};

const SFX_SOUNDS = {
    buzzer:  'SYS_buzzer.ogg',
    arrow:   'SFX_arrow.mp3',
    potion:  'SFX_potion.mp3',
    shield:  'SFX_Shield.mp3',
    sword:   'SFX_Sword.mp3',
};

class AudioManager {
    constructor() {
        this.musicEnabled = true;
        this.sfxEnabled   = true;
        this.currentMusic = null;
        this.currentTrack = null;
        this._fadeRaf     = null;
        this._loadSettings();
    }

    _loadSettings() {
        try {
            const m = localStorage.getItem('return_music_enabled');
            const s = localStorage.getItem('return_sfx_enabled');
            this.musicEnabled = m !== 'false';
            this.sfxEnabled   = s !== 'false';
        } catch (e) {
            // localStorage may be unavailable in some environments
        }
    }

    _saveSettings() {
        try {
            localStorage.setItem('return_music_enabled', String(this.musicEnabled));
            localStorage.setItem('return_sfx_enabled',   String(this.sfxEnabled));
        } catch (e) {
            // ignore
        }
    }

    setMusicEnabled(enabled) {
        this.musicEnabled = enabled;
        this._saveSettings();
        if (this.currentMusic) {
            this.currentMusic.volume = enabled ? 1.0 : 0.0;
        }
    }

    setSFXEnabled(enabled) {
        this.sfxEnabled = enabled;
        this._saveSettings();
    }

    _stopFade() {
        if (this._fadeRaf) {
            cancelAnimationFrame(this._fadeRaf);
            this._fadeRaf = null;
        }
    }

    _fadeIn(audio, duration = 500) {
        this._stopFade();
        const startTime = performance.now();
        audio.volume = 0;
        const tick = (now) => {
            const elapsed = now - startTime;
            const t = Math.min(1, elapsed / duration);
            audio.volume = t;
            if (t < 1) {
                this._fadeRaf = requestAnimationFrame(tick);
            } else {
                this._fadeRaf = null;
            }
        };
        this._fadeRaf = requestAnimationFrame(tick);
    }

    playMusic(trackName) {
        if (this.currentTrack === trackName) return;
        const file = MUSIC_TRACKS[trackName];
        if (!file) {
            console.warn('AudioManager: unknown music track', trackName);
            return;
        }

        // Hard-stop any currently playing music
        this._stopFade();
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }

        const next = new Audio(AUDIO_PATH + file);
        next.loop = true;
        next.volume = 0;

        this.currentMusic = next;
        this.currentTrack = trackName;

        next.play().then(() => {
            if (this.musicEnabled) {
                this._fadeIn(next, 500);
            } else {
                next.volume = 0;
            }
        }).catch(err => {
            // Browsers block autoplay until user interaction.
            console.warn('AudioManager: music play blocked', err);
        });
    }

    pauseMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
        }
    }

    resumeMusic() {
        if (this.currentMusic && this.musicEnabled) {
            this.currentMusic.play().catch(() => {});
        }
    }

    stopMusic() {
        this._stopFade();
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }
        this.currentMusic = null;
        this.currentTrack = null;
    }

    playSFX(soundName) {
        if (!this.sfxEnabled) return;
        const file = SFX_SOUNDS[soundName];
        if (!file) {
            console.warn('AudioManager: unknown SFX', soundName);
            return;
        }
        const audio = new Audio(AUDIO_PATH + file);
        audio.volume = 1.0;
        audio.play().catch(err => {
            console.warn('AudioManager: SFX play blocked', err);
        });
    }
}

const instance = new AudioManager();
export default instance;
