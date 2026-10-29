import { Component, signal, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-time-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="audio-mensaje" class="time-message-section" aria-label="Un mensaje atrapado en el tiempo">
      <!-- Nota romántica con flecha apuntando a la sección -->
      <div class="pointer-note-wrapper">
        <div class="pointer-note">
          <span class="note-pin">📌</span>
          <p class="note-text font-handwriting">
            “Amor, perdón por no saber expresarme tanto, pero quiero que sepas que desde toda mi alma te juro que te amo y que siempre estaré para ti en las buenas y en las malas.”
          </p>
        </div>
        <div class="arrow-container" aria-hidden="true">
          <svg class="bouncing-arrow" viewBox="0 0 50 65" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 25 5 Q 35 30 25 50" stroke="var(--gold-accent)" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="5 4"/>
            <polygon points="25,62 16,48 34,48" fill="var(--gold-accent)"/>
          </svg>
        </div>
      </div>

      <div class="message-capsule-card glass-card">
        <h2 class="capsule-title font-serif">Un mensaje atrapado en el tiempo</h2>
        <p class="capsule-subtitle font-handwriting">
          Dale play amor
        </p>

        <!-- Aesthetic Cassette / Voice Note Player -->
        <div class="cassette-player">
          <div class="washi-tape-accent"></div>

          <!-- Cassette Body -->
          <div class="cassette-body">
            <!-- Cassette Header / Label -->
            <div class="cassette-label">
              <div class="label-header">
                <span class="tape-tag">SIDE A • 26/10/2025</span>
                <span class="tape-brand font-handwriting">Para Pía Valentina ❤️</span>
              </div>
              
              <!-- Reels Window -->
              <div class="cassette-window">
                <div class="reel reel-left" [class.spinning]="isPlaying()">
                  <div class="reel-inner"></div>
                </div>
                <div class="tape-spool-bridge">
                  <div class="magnetic-tape" [class.tape-moving]="isPlaying()"></div>
                </div>
                <div class="reel reel-right" [class.spinning]="isPlaying()">
                  <div class="reel-inner"></div>
                </div>
              </div>
            </div>

            <!-- Waveform Animation Bars -->
            <div class="audio-waveform" [class.is-active]="isPlaying()">
              <span class="bar" *ngFor="let h of waveBars; let i = index" [style.--bar-h]="h + 'px'" [style.animation-delay]="(i * 0.08) + 's'"></span>
            </div>

            <!-- Audio Player Controls -->
            <div class="player-controls-strip">
              <!-- Play / Pause Button -->
              <button 
                class="play-toggle-btn" 
                (click)="togglePlay()" 
                [attr.aria-label]="isPlaying() ? 'Pausar nota de voz' : 'Reproducir mensaje de voz'">
                @if (isPlaying()) {
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="2"></rect>
                    <rect x="14" y="4" width="4" height="16" rx="2"></rect>
                  </svg>
                } @else {
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" style="margin-left: 3px;">
                    <polygon points="6 3 20 12 6 21 6 3"></polygon>
                  </svg>
                }
              </button>

              <!-- Progress Bar & Timing -->
              <div class="progress-container">
                <div class="time-display">
                  <span class="curr-time">{{ formatTime(currentTime()) }}</span>
                  <span class="total-time">{{ formatTime(duration()) }}</span>
                </div>
                <div class="seek-track" (click)="seekAudio($event)">
                  <div class="seek-fill" [style.width.%]="progressPercent()"></div>
                  <div class="seek-thumb" [style.left.%]="progressPercent()"></div>
                </div>
              </div>
            </div>

            <!-- Hidden Audio Element -->
            <audio 
              #audioElement
              preload="metadata"
              (timeupdate)="onTimeUpdate()"
              (loadedmetadata)="onLoadedMetadata()"
              (ended)="onEnded()"
              (error)="onError()">
              <source src="audios/audio.mp4" type="audio/mp4">
              <source src="audios/audio.mp4" type="video/mp4">
              <source src="audios/audio.mp3" type="audio/mp3">
            </audio>

            <!-- Waiting for file helper note if not found -->
            @if (hasError()) {
              <div class="audio-notice">
                <span class="notice-icon">📂</span>
                <p>
                  Para escuchar tu voz, coloca tu archivo <strong>audio.mp4</strong> en:
                </p>
                <code>26-10-25/public/audios/audio.mp4</code>
                <span class="notice-sub">¡En cuanto lo pegues ahí sonará automáticamente al presionar Play!</span>
              </div>
            }
          </div>
        </div>

        <div class="capsule-footer font-handwriting">
          <span>“Espero pronto conocer a toda tu familia amor”</span>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .time-message-section {
      padding: 50px 20px 80px;
      max-width: 860px;
      margin: 0 auto;
      text-align: center;
      position: relative;
      z-index: 2;
    }

    /* Nota cariñosa que apunta a la sección */
    .pointer-note-wrapper {
      max-width: 580px;
      margin: 0 auto 24px;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .pointer-note {
      position: relative;
      background: linear-gradient(135deg, rgba(255, 248, 235, 0.96) 0%, rgba(254, 235, 200, 0.92) 100%);
      color: #38121f;
      padding: 22px 28px 18px;
      border-radius: 16px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.45), 0 0 25px rgba(229, 184, 105, 0.35);
      border: 2px dashed rgba(229, 184, 105, 0.7);
      transform: rotate(-1.5deg);
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);

      &:hover {
        transform: rotate(0deg) scale(1.02);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.55), 0 0 35px rgba(232, 99, 126, 0.4);
      }

      .note-pin {
        position: absolute;
        top: -14px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 1.4rem;
        filter: drop-shadow(0 3px 5px rgba(0, 0, 0, 0.4));
      }

      .note-text {
        font-size: 1.45rem;
        line-height: 1.45;
        margin: 0;
        letter-spacing: 0.3px;
        font-weight: 600;
        color: #4a1525;
      }
    }

    .arrow-container {
      margin-top: 10px;
      display: flex;
      justify-content: center;
    }

    .bouncing-arrow {
      width: 48px;
      height: 58px;
      color: var(--gold-accent);
      animation: arrowBounce 1.8s ease-in-out infinite;
      filter: drop-shadow(0 0 8px rgba(229, 184, 105, 0.7));
    }

    @keyframes arrowBounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(10px);
      }
    }

    .message-capsule-card {
      padding: 48px 30px 42px;
      border: 1px solid rgba(229, 184, 105, 0.4);
      background: radial-gradient(circle at 50% 20%, rgba(48, 22, 38, 0.9) 0%, rgba(18, 9, 22, 0.97) 100%);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(229, 184, 105, 0.22);
      border-radius: var(--radius-lg);
      position: relative;
    }

    .capsule-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 18px;
      background: rgba(229, 184, 105, 0.15);
      border: 1px solid rgba(229, 184, 105, 0.35);
      border-radius: 9999px;
      font-size: 0.85rem;
      color: var(--gold-accent);
      margin-bottom: 16px;
      letter-spacing: 0.5px;
    }

    .capsule-title {
      font-size: clamp(2rem, 5vw, 3rem);
      color: #fff;
      margin-bottom: 8px;
    }

    .capsule-subtitle {
      font-size: 1.45rem;
      color: var(--rose-light);
      margin-bottom: 34px;
    }

    /* Cassette Player Container */
    .cassette-player {
      position: relative;
      max-width: 580px;
      width: 100%;
      margin: 0 auto 30px;
    }

    .washi-tape-accent {
      position: absolute;
      top: -14px;
      left: 50%;
      transform: translateX(-50%);
      width: 120px;
      height: 26px;
      background: rgba(229, 184, 105, 0.85);
      clip-path: polygon(4% 0%, 96% 0%, 100% 100%, 0% 100%);
      z-index: 3;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .cassette-body {
      background: linear-gradient(145deg, #241421 0%, #150b18 100%);
      border: 2px solid rgba(247, 162, 180, 0.35);
      border-radius: 18px;
      padding: 28px 24px 22px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(232, 99, 126, 0.2);
      position: relative;
    }

    .cassette-label {
      background: #fbf5ed;
      color: #2b1722;
      border-radius: 10px;
      padding: 16px 18px;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
      border: 2px solid rgba(229, 184, 105, 0.5);
      margin-bottom: 22px;
    }

    .label-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px dashed rgba(140, 80, 100, 0.4);
      padding-bottom: 6px;
      margin-bottom: 12px;

      .tape-tag {
        font-size: 0.72rem;
        font-family: var(--font-sans);
        font-weight: 700;
        letter-spacing: 1px;
        color: #7a2b42;
      }

      .tape-brand {
        font-size: 1.25rem;
        color: #a02847;
      }
    }

    /* Cassette Reels Window */
    .cassette-window {
      background: #180d19;
      border-radius: 8px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      border: 2px inset rgba(0, 0, 0, 0.6);
      position: relative;
    }

    .reel {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #fbf5ed;
      border: 3px solid #63172e;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      .reel-inner {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #180d19;
        border: 2px dashed #a02847;
      }

      &.spinning {
        animation: spinReel 2.5s linear infinite;
      }
    }

    @keyframes spinReel {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .tape-spool-bridge {
      flex: 1;
      height: 12px;
      margin: 0 16px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 4px;
      overflow: hidden;
      position: relative;
    }

    .magnetic-tape {
      width: 100%;
      height: 100%;
      background: repeating-linear-gradient(
        90deg,
        #4a1525 0px,
        #4a1525 8px,
        #6b1e35 8px,
        #6b1e35 16px
      );

      &.tape-moving {
        animation: moveTape 1s linear infinite;
      }
    }

    @keyframes moveTape {
      from { background-position: 0 0; }
      to { background-position: 32px 0; }
    }

    /* Waveform Animation */
    .audio-waveform {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      height: 38px;
      margin-bottom: 20px;

      .bar {
        width: 3.5px;
        height: 6px;
        background: linear-gradient(to top, var(--rose-primary), var(--gold-accent));
        border-radius: 9999px;
        transition: height 0.2s ease;
      }

      &.is-active .bar {
        animation: waveAnim 0.8s ease-in-out infinite alternate;
      }
    }

    @keyframes waveAnim {
      0% { height: 6px; }
      100% { height: var(--bar-h, 28px); }
    }

    /* Player Controls */
    .player-controls-strip {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 6px 10px;
    }

    .play-toggle-btn {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: linear-gradient(135deg, #e8637e 0%, #a02847 100%);
      border: 2px solid rgba(255, 255, 255, 0.4);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 6px 20px var(--rose-glow);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      flex-shrink: 0;

      &:hover {
        transform: scale(1.08);
        box-shadow: 0 10px 25px rgba(232, 99, 126, 0.5);
      }

      &:active {
        transform: scale(0.96);
      }
    }

    .progress-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .time-display {
      display: flex;
      justify-content: space-between;
      font-size: 0.78rem;
      color: var(--text-muted);
      font-family: var(--font-sans);
    }

    .seek-track {
      position: relative;
      height: 8px;
      background: rgba(255, 255, 255, 0.12);
      border-radius: 9999px;
      cursor: pointer;
    }

    .seek-fill {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      background: linear-gradient(90deg, var(--rose-primary), var(--gold-accent));
      border-radius: 9999px;
      transition: width 0.1s linear;
    }

    .seek-thumb {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 14px;
      height: 14px;
      background: #fff;
      border: 2px solid var(--rose-primary);
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(232, 99, 126, 0.8);
      pointer-events: none;
    }

    /* Notice box if audio not placed yet */
    .audio-notice {
      margin-top: 18px;
      background: rgba(0, 0, 0, 0.45);
      border: 1px dashed rgba(247, 162, 180, 0.35);
      border-radius: 10px;
      padding: 14px 16px;
      font-size: 0.85rem;
      color: var(--text-muted);

      .notice-icon {
        font-size: 24px;
        display: block;
        margin-bottom: 6px;
      }

      code {
        display: block;
        background: rgba(0, 0, 0, 0.5);
        color: var(--gold-accent);
        padding: 4px 8px;
        border-radius: 6px;
        margin: 6px 0;
      }

      .notice-sub {
        font-size: 0.75rem;
        color: var(--rose-light);
      }
    }

    .capsule-footer {
      font-size: 1.7rem;
      color: var(--rose-light);
      margin-top: 24px;
    }

    @media (max-width: 600px) {
      .message-capsule-card {
        padding: 32px 16px 26px;
      }
      .cassette-body {
        padding: 20px 14px 16px;
      }
      .cassette-window {
        padding: 0 12px;
      }
      .capsule-footer {
        font-size: 1.35rem;
      }
    }
  `]
})
export class TimeMessageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('audioElement') audioRef!: ElementRef<HTMLAudioElement>;

  public isPlaying = signal<boolean>(false);
  public currentTime = signal<number>(0);
  public duration = signal<number>(0);
  public hasError = signal<boolean>(false);

  public waveBars: number[] = [
    12, 22, 34, 18, 28, 14, 32, 24, 16, 30, 20, 26, 36, 18, 24, 30, 14, 22, 32, 18, 28, 14
  ];

  ngAfterViewInit(): void {
    // Initial check
  }

  ngOnDestroy(): void {
    if (this.audioRef?.nativeElement) {
      this.audioRef.nativeElement.pause();
    }
  }

  public togglePlay(): void {
    const audio = this.audioRef?.nativeElement;
    if (!audio) return;

    if (this.isPlaying()) {
      audio.pause();
      this.isPlaying.set(false);
    } else {
      audio.play().then(() => {
        this.isPlaying.set(true);
        this.hasError.set(false);
      }).catch(() => {
        // file not yet added or autoplay blocked
        this.hasError.set(true);
        this.isPlaying.set(false);
      });
    }
  }

  public onTimeUpdate(): void {
    const audio = this.audioRef?.nativeElement;
    if (audio) {
      this.currentTime.set(audio.currentTime);
    }
  }

  public onLoadedMetadata(): void {
    const audio = this.audioRef?.nativeElement;
    if (audio && !isNaN(audio.duration)) {
      this.duration.set(audio.duration);
      this.hasError.set(false);
    }
  }

  public onEnded(): void {
    this.isPlaying.set(false);
    this.currentTime.set(0);
  }

  public onError(): void {
    this.hasError.set(true);
    this.isPlaying.set(false);
  }

  public seekAudio(event: MouseEvent): void {
    const audio = this.audioRef?.nativeElement;
    if (!audio || !this.duration()) return;

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    audio.currentTime = pct * this.duration();
  }

  public progressPercent(): number {
    const dur = this.duration();
    if (!dur) return 0;
    return (this.currentTime() / dur) * 100;
  }

  public formatTime(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
}
