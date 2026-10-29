import { Component, inject } from '@angular/core';
import { MusicService } from '../../services/music.service';

@Component({
  selector: 'app-music-player',
  standalone: true,
  template: `
    <aside class="music-floating-widget" [class.is-playing]="music.isPlaying()" aria-label="Reproductor de música">
      <div class="vinyl-container" (click)="music.togglePlay()" title="Reproducir / Pausar nuestra melodía">
        <div class="vinyl-disc" [class.spinning]="music.isPlaying()">
          <div class="vinyl-grooves"></div>
          <div class="vinyl-center">
            <span class="heart-icon">❤️</span>
          </div>
        </div>
      </div>

      <div class="player-info">
        <div class="song-title-wrapper">
          <span class="song-title">{{ music.currentTrackName() }}</span>
          @if (music.isPlaying()) {
            <div class="equalizer-bars">
              <span class="bar b1"></span>
              <span class="bar b2"></span>
              <span class="bar b3"></span>
              <span class="bar b4"></span>
            </div>
          }
        </div>
        
        <div class="player-controls">
          <button class="control-btn" (click)="music.togglePlay()" [attr.aria-label]="music.isPlaying() ? 'Pausar música' : 'Reproducir música'">
            @if (music.isPlaying()) {
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="2"></rect>
                <rect x="14" y="4" width="4" height="16" rx="2"></rect>
              </svg>
            } @else {
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <polygon points="6 3 20 12 6 21 6 3"></polygon>
              </svg>
            }
          </button>
          <span class="volume-label">{{ music.isPlaying() ? 'Sonando para ti' : 'Toca para escuchar' }}</span>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .music-floating-widget {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 100;
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 10px 18px 10px 12px;
      background: rgba(22, 12, 28, 0.88);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid rgba(247, 162, 180, 0.25);
      border-radius: 9999px;
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5), 0 0 20px rgba(232, 99, 126, 0.2);
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);

      &:hover {
        border-color: rgba(247, 162, 180, 0.5);
        transform: translateY(-2px);
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(232, 99, 126, 0.35);
      }
    }

    .vinyl-container {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .vinyl-disc {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: radial-gradient(circle, #2a2a2a 0%, #111111 70%, #000 100%);
      border: 2px solid rgba(255, 255, 255, 0.15);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
      transition: transform 0.3s ease;

      &.spinning {
        animation: rotateVinyl 4s linear infinite;
      }
    }

    @keyframes rotateVinyl {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .vinyl-grooves {
      position: absolute;
      inset: 4px;
      border-radius: 50%;
      border: 1px dashed rgba(255, 255, 255, 0.12);
    }

    .vinyl-center {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: linear-gradient(135deg, #e8637e, #a02847);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8px;
    }

    .player-info {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .song-title-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .song-title {
      font-size: 0.82rem;
      font-weight: 600;
      color: #fff;
      max-width: 170px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      letter-spacing: 0.3px;
    }

    .player-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .control-btn {
      background: none;
      border: none;
      color: var(--rose-light, #f7a2b4);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: color 0.2s ease, transform 0.2s ease;

      &:hover {
        color: #fff;
        transform: scale(1.15);
      }
    }

    .volume-label {
      font-size: 0.72rem;
      color: var(--text-muted, #cdbac8);
    }

    .equalizer-bars {
      display: flex;
      align-items: flex-end;
      gap: 2px;
      height: 12px;

      .bar {
        width: 2.5px;
        background: linear-gradient(to top, var(--rose-primary, #e8637e), var(--gold-accent, #e5b869));
        border-radius: 1px;
        animation: eqPulse 1s ease-in-out infinite alternate;
      }

      .b1 { height: 6px; animation-delay: 0.1s; }
      .b2 { height: 11px; animation-delay: 0.3s; }
      .b3 { height: 8px; animation-delay: 0.2s; }
      .b4 { height: 12px; animation-delay: 0.4s; }
    }

    @keyframes eqPulse {
      0% { height: 3px; }
      100% { height: 12px; }
    }

    @media (max-width: 640px) {
      .music-floating-widget {
        bottom: 16px;
        right: 16px;
        padding: 8px 14px 8px 10px;
      }
      .song-title {
        max-width: 120px;
        font-size: 0.75rem;
      }
    }
  `]
})
export class MusicPlayerComponent {
  public music = inject(MusicService);
}
