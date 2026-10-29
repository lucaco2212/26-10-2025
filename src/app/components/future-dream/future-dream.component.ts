import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-future-dream',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="future-dream-section" aria-label="Nuestro Futuro">
      <div class="dream-card glass-card">
        <!-- Floating badge -->
        <div class="dream-badge">
          <span>✨ Un sueño para el futuro</span>
        </div>

        <!-- Big Framed Photo Container -->
        <div class="photo-frame-container">
          <div class="washi-tape-accent"></div>
          
          <div class="photo-frame">
            <img src="photos/hijos.jpg" alt="Espero que nuestros hijos se vean similares" loading="lazy">
            <div class="frame-shine"></div>
          </div>
        </div>

        <!-- The Phrase -->
        <div class="phrase-container">
          <p class="dream-quote font-handwriting">
            “Espero que nuestros hijos se vean similares”
          </p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .future-dream-section {
      padding: 60px 20px 70px;
      max-width: 860px;
      margin: 0 auto;
      text-align: center;
      position: relative;
      z-index: 2;
    }

    .dream-card {
      padding: 45px 30px 40px;
      border: 1px solid rgba(247, 162, 180, 0.35);
      background: radial-gradient(circle at 50% 20%, rgba(45, 18, 35, 0.85) 0%, rgba(18, 9, 22, 0.95) 100%);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.65), 0 0 35px rgba(232, 99, 126, 0.22);
      border-radius: var(--radius-lg);
      position: relative;
    }

    .dream-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 18px;
      background: rgba(229, 184, 105, 0.15);
      border: 1px solid rgba(229, 184, 105, 0.35);
      border-radius: 9999px;
      font-size: 0.85rem;
      color: var(--gold-accent);
      margin-bottom: 28px;
      letter-spacing: 0.5px;
    }

    .photo-frame-container {
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
      width: 110px;
      height: 28px;
      background: rgba(229, 184, 105, 0.85);
      clip-path: polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%);
      z-index: 3;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    }

    .photo-frame {
      position: relative;
      background: #fbf7f0;
      padding: 16px 16px 20px;
      border-radius: 12px;
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6), 0 0 30px rgba(232, 99, 126, 0.25);
      overflow: hidden;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;

      &:hover {
        transform: translateY(-6px) scale(1.02);
        box-shadow: 0 28px 60px rgba(0, 0, 0, 0.75), 0 0 45px rgba(232, 99, 126, 0.4);
      }

      img {
        width: 100%;
        height: auto;
        max-height: 480px;
        object-fit: cover;
        border-radius: 8px;
        display: block;
      }
    }

    .phrase-container {
      max-width: 620px;
      margin: 0 auto;
    }

    .dream-quote {
      font-size: clamp(2rem, 5vw, 3.1rem);
      line-height: 1.25;
      color: #fff;
      font-weight: 700;
      text-shadow: 0 2px 14px rgba(232, 99, 126, 0.6);
      margin-bottom: 0;
    }

    .quote-subtext {
      font-size: 1rem;
      color: var(--text-muted);
      line-height: 1.6;
    }

    @media (max-width: 600px) {
      .future-dream-section {
        padding: 40px 14px;
      }
      .dream-card {
        padding: 30px 16px 25px;
      }
      .photo-frame {
        padding: 10px 10px 14px;
      }
    }
  `]
})
export class FutureDreamComponent {}
