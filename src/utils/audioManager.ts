import { SoundType } from '../types';

class AudioManager {
    private sounds: Map<SoundType, HTMLAudioElement> = new Map();
    private musicElement: HTMLAudioElement | null = null;
    private soundEnabled = true;
    private musicEnabled = false;
    private initialized = false;

    async init() {
        if (this.initialized) return;

        // Preload sounds
        const soundFiles: Record<SoundType, string> = {
            diceRoll: '/sounds/dice-roll.mp3',
            tokenMove: '/sounds/dice-roll.mp3', // Using dice roll as move sound
            kill: '/sounds/kill-sound.mp3',
            celebration: '/sounds/celebration.mp3',
            click: '/sounds/dice-roll.mp3', // Using dice roll as click sound
        };

        for (const [type, path] of Object.entries(soundFiles)) {
            try {
                const audio = new Audio(path);
                audio.preload = 'auto';
                this.sounds.set(type as SoundType, audio);
            } catch (error) {
                console.warn(`Failed to load sound: ${path}`);
            }
        }

        // Load background music
        try {
            this.musicElement = new Audio('/sounds/background-music.mp3');
            this.musicElement.loop = true;
            this.musicElement.volume = 0.3;
        } catch (error) {
            console.warn('Failed to load background music');
        }

        this.initialized = true;
    }

    play(type: SoundType) {
        if (!this.soundEnabled) return;

        const sound = this.sounds.get(type);
        if (sound) {
            // Clone the audio to allow overlapping sounds
            const clone = sound.cloneNode() as HTMLAudioElement;
            clone.volume = 0.5;
            clone.play().catch(() => {
                // Ignore autoplay errors
            });
        }
    }

    playMusic() {
        if (!this.musicEnabled || !this.musicElement) return;

        this.musicElement.play().catch(() => {
            // Ignore autoplay errors
        });
    }

    pauseMusic() {
        if (this.musicElement) {
            this.musicElement.pause();
        }
    }

    setSoundEnabled(enabled: boolean) {
        this.soundEnabled = enabled;
    }

    setMusicEnabled(enabled: boolean) {
        this.musicEnabled = enabled;
        if (enabled) {
            this.playMusic();
        } else {
            this.pauseMusic();
        }
    }

    isSoundEnabled() {
        return this.soundEnabled;
    }

    isMusicEnabled() {
        return this.musicEnabled;
    }
}

export const audioManager = new AudioManager();
