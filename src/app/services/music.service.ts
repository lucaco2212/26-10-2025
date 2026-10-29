import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  public isPlaying = signal<boolean>(false);
  public currentTrackName = signal<string>('Melodía para nosotros (Music Box)');
  public volume = signal<number>(0.35);

  private audioCtx: AudioContext | null = null;
  private intervalId: any = null;
  private noteIndex = 0;

  // Romantic gentle music box arpeggios (in Hz)
  // Inspired by gentle romantic progression: D - A - Bm - F#m - G - D - G - A
  private melodyNotes: number[] = [
    // Phrase 1 (D & A)
    293.66, 369.99, 440.00, 587.33, 440.00, 369.99,
    220.00, 277.18, 329.63, 440.00, 329.63, 277.18,
    // Phrase 2 (Bm & F#m)
    246.94, 293.66, 369.99, 493.88, 369.99, 293.66,
    185.00, 220.00, 277.18, 369.99, 277.18, 220.00,
    // Phrase 3 (G & D)
    196.00, 246.94, 293.66, 392.00, 293.66, 246.94,
    293.66, 369.99, 440.00, 587.33, 440.00, 369.99,
    // Phrase 4 (G & A high resolve)
    392.00, 493.88, 587.33, 783.99, 587.33, 493.88,
    440.00, 554.37, 659.25, 880.00, 659.25, 554.37
  ];

  public togglePlay(): void {
    if (this.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  }

  public play(): void {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    this.isPlaying.set(true);

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Play initial note immediately
    this.playNextNote();
    // Tempo: ~340ms per note (gentle, warm music-box tempo)
    this.intervalId = setInterval(() => {
      this.playNextNote();
    }, 340);
  }

  public pause(): void {
    this.isPlaying.set(false);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private playNextNote(): void {
    if (!this.audioCtx || !this.isPlaying()) return;

    const freq = this.melodyNotes[this.noteIndex];
    this.noteIndex = (this.noteIndex + 1) % this.melodyNotes.length;

    this.createMusicBoxTone(freq);
  }

  private createMusicBoxTone(freq: number): void {
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    // Soft chime-like timbre: sine with slight harmonic warmth
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Warm envelope (instant attack, gentle decay like a music box/harp)
    const currentVol = this.volume();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(currentVol * 0.28, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 1.45);
  }

  public playChimeSound(): void {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const chords = [523.25, 659.25, 783.99, 1046.50]; // C Major high harp sparkle
    chords.forEach((note, index) => {
      setTimeout(() => {
        this.createMusicBoxTone(note);
      }, index * 85);
    });
  }
}
