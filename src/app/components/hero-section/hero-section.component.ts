import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="hero-container" aria-label="Bienvenida">
      <!-- Glow backlight effect -->
      <div class="hero-glow"></div>

      <!-- Date Badge -->
      <div class="date-badge">
        <span class="heart-pulse">❤️</span>
        <span class="date-text">26 · Octubre · 2025</span>
        <span class="sparkle">✨</span>
      </div>

      <!-- Main Headline -->
      <h1 class="hero-title font-serif">
        Página del pasado <br class="br-mobile" />
        <span class="text-gradient">(26/10/2025)</span>
      </h1>

      <!-- Emotional Subtitle -->
      <p class="hero-subtitle">
        Hola amor, te habla toñito del pasado. Espero que disfrutes esta página que te hice con tanto amor un día 26/10/2025 y recuerdes lo mucho que te amo a pesar de los años que pasen. <br />
        Te amo y nunca dejaré de amarte. ❤️
      </p>

      <!-- Quick Action Navigation Links -->
      <nav class="hero-nav-actions" aria-label="Secciones">
        <a href="#carta" class="btn-romantic">
          <span>💌 Leer nuestra carta</span>
        </a>
        <a href="#fotos" class="btn-secondary-romantic">
          <span>📸 Ver nuestras fotos</span>
        </a>
        <a href="#video" class="btn-secondary-romantic">
          <span>🎬 Nuestro video</span>
        </a>
      </nav>

      <!-- Gentle scroll indicator -->
      <a href="#carta" class="scroll-indicator" aria-label="Deslizar hacia abajo">
        <span class="scroll-heart">♡</span>
        <span class="scroll-text">Desliza para descubrir</span>
      </a>
    </header>
  `,
  styles: [`
    .hero-container {
      min-height: 85vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 90px 24px 50px;
      position: relative;
      z-index: 2;
    }

    .hero-glow {
      position: absolute;
      top: 35%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: min(600px, 90vw);
      height: 380px;
      background: radial-gradient(circle, rgba(232, 99, 126, 0.22) 0%, rgba(140, 50, 80, 0.08) 50%, transparent 75%);
      pointer-events: none;
      filter: blur(50px);
      z-index: -1;
    }

    .date-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 8px 22px;
      background: rgba(45, 18, 35, 0.7);
      border: 1px solid rgba(247, 162, 180, 0.45);
      border-radius: 9999px;
      font-size: 0.95rem;
      font-weight: 500;
      color: #fff;
      margin-bottom: 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      animation: floatBadge 3s ease-in-out infinite alternate;

      .heart-pulse {
        animation: pulseHeart 1.8s infinite ease-in-out;
      }

      .date-text {
        letter-spacing: 2px;
        color: #ffd9e2;
        font-weight: 600;
      }
    }

    @keyframes floatBadge {
      0% { transform: translateY(0); }
      100% { transform: translateY(-6px); }
    }

    .hero-title {
      font-size: clamp(2.8rem, 7.5vw, 5.2rem);
      line-height: 1.15;
      font-weight: 800;
      letter-spacing: -1px;
      color: #ffffff;
      margin-bottom: 20px;
      max-width: 900px;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }

    .hero-subtitle {
      max-width: 680px;
      font-size: clamp(1rem, 2.5vw, 1.2rem);
      color: var(--text-muted);
      line-height: 1.8;
      margin-bottom: 40px;
      font-weight: 400;
    }

    /* Navigation Actions */
    .hero-nav-actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 16px;
      margin-bottom: 50px;
    }

    .scroll-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.8rem;
      letter-spacing: 1px;
      text-transform: uppercase;
      opacity: 0.75;
      transition: all 0.3s ease;

      &:hover {
        opacity: 1;
        color: var(--rose-light);
        transform: translateY(3px);
      }

      .scroll-heart {
        font-size: 1.4rem;
        color: var(--rose-primary);
        animation: heartDrop 2s infinite ease-in-out;
      }
    }

    @keyframes heartDrop {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(8px); }
    }

    @media (max-width: 600px) {
      .hero-container {
        padding: 80px 18px 40px;
      }
    }
  `]
})
export class HeroSectionComponent {}
