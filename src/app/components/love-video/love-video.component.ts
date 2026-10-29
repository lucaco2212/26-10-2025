import { Component, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-love-video',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="video" class="video-section" aria-label="Nuestro Video">
      <div class="video-card glass-card">
        <div class="section-badge">
          <span class="badge-icon">🎬</span>
          <span>Un momento en movimiento</span>
        </div>

        <h2 class="video-title font-serif">El día más feliz de mi vida</h2>

        <!-- Video Player Frame -->
        <div class="video-frame-wrapper">
          <div class="washi-tape-video"></div>

          <div class="video-frame">
            <video 
              #videoPlayer
              controls 
              playsinline
              preload="metadata"
              (loadeddata)="videoLoaded.set(true)"
              (error)="videoError.set(true)"
              class="romantic-video">
              <source src="videos/video.mp4" type="video/mp4">
              <source src="video.mp4" type="video/mp4">
              Tu navegador no soporta reproducción de video.
            </video>

            <!-- Placeholder if video file is not yet placed -->
            @if (videoError()) {
              <div class="video-placeholder">
                <span class="placeholder-icon">📹</span>
                <h4 class="font-serif">Esperando tu video</h4>
                <p>
                  Coloca tu archivo llamado <strong>video.mp4</strong> en la carpeta:
                </p>
                <code>26-10-25/public/videos/video.mp4</code>
                <span class="placeholder-hint">¡Aparecerá aquí automáticamente en cuanto lo pegues! ❤️</span>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .video-section {
      padding: 50px 20px 70px;
      max-width: 860px;
      margin: 0 auto;
      text-align: center;
      position: relative;
      z-index: 2;
    }

    .video-card {
      padding: 45px 30px 38px;
      border: 1px solid rgba(247, 162, 180, 0.35);
      background: radial-gradient(circle at 50% 25%, rgba(45, 18, 35, 0.85) 0%, rgba(18, 9, 22, 0.96) 100%);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.65), 0 0 35px rgba(232, 99, 126, 0.22);
      border-radius: var(--radius-lg);
    }

    .section-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: rgba(232, 99, 126, 0.15);
      border: 1px solid rgba(247, 162, 180, 0.3);
      border-radius: 9999px;
      font-size: 0.85rem;
      color: var(--rose-light, #f7a2b4);
      margin-bottom: 16px;
      letter-spacing: 0.5px;
    }

    .video-title {
      font-size: clamp(2rem, 5vw, 3rem);
      color: #fff;
      margin-bottom: 32px;
    }

    .video-subtitle {
      max-width: 580px;
      margin: 0 auto 36px;
      font-size: 1.05rem;
      color: var(--text-muted);
      line-height: 1.6;
    }

    .video-frame-wrapper {
      position: relative;
      max-width: 680px;
      width: 100%;
      margin: 0 auto;
    }

    .washi-tape-video {
      position: absolute;
      top: -14px;
      left: 50%;
      transform: translateX(-50%);
      width: 110px;
      height: 26px;
      background: rgba(247, 162, 180, 0.85);
      clip-path: polygon(4% 0%, 96% 0%, 100% 100%, 0% 100%);
      z-index: 3;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .video-frame {
      position: relative;
      background: #0f0813;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(232, 99, 126, 0.3);
      border: 2px solid rgba(255, 200, 220, 0.25);
      min-height: 320px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .romantic-video {
      width: 100%;
      max-height: 520px;
      display: block;
      outline: none;
      background: #000;
    }

    .video-placeholder {
      position: absolute;
      inset: 0;
      background: rgba(25, 12, 30, 0.95);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 30px 20px;
      gap: 12px;
      color: #fff;

      .placeholder-icon {
        font-size: 48px;
        filter: drop-shadow(0 4px 10px rgba(232, 99, 126, 0.5));
      }

      h4 {
        font-size: 1.5rem;
        color: var(--rose-light);
      }

      p {
        font-size: 0.95rem;
        color: var(--text-muted);
      }

      code {
        background: rgba(0, 0, 0, 0.6);
        border: 1px dashed rgba(247, 162, 180, 0.4);
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 0.9rem;
        color: var(--gold-accent);
      }

      .placeholder-hint {
        font-size: 0.85rem;
        color: var(--rose-light);
      }
    }

    .video-footer {
      font-size: 1.7rem;
      color: var(--rose-light);
      line-height: 1.4;
      margin-top: 10px;
    }

    @media (max-width: 600px) {
      .video-card {
        padding: 30px 16px 25px;
      }
      .video-footer {
        font-size: 1.4rem;
      }
    }
  `]
})
export class LoveVideoComponent {
  @ViewChild('videoPlayer') videoPlayerRef!: ElementRef<HTMLVideoElement>;
  public videoLoaded = signal<boolean>(false);
  public videoError = signal<boolean>(false);
}
