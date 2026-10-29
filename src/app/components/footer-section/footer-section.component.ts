import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="romantic-footer" aria-label="Pie de página">
      <div class="footer-divider">
        <span class="divider-line"></span>
        <span class="divider-heart">🌹</span>
        <span class="divider-line"></span>
      </div>

      <div class="footer-body">
        <p class="footer-quote font-handwriting">
          “Si volviera a nacer mil veces, en las mil te buscaría.”
        </p>
        <p class="footer-love-tag">
          Hecho con todo el amor y dedicación del mundo para ti.
        </p>
        <p class="footer-date">26 · Octubre · 2025 • Para Siempre</p>
        
        <button class="back-to-top-btn" (click)="scrollToTop()" aria-label="Volver al inicio">
          <span>Volver arriba ↑</span>
        </button>
      </div>
    </footer>
  `,
  styles: [`
    .romantic-footer {
      padding: 60px 20px 80px;
      text-align: center;
      position: relative;
      z-index: 2;
    }

    .footer-divider {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      max-width: 500px;
      margin: 0 auto 35px;

      .divider-line {
        flex: 1;
        height: 1px;
        background: linear-gradient(to right, transparent, rgba(247, 162, 180, 0.3), transparent);
      }

      .divider-heart {
        font-size: 22px;
        filter: drop-shadow(0 0 10px rgba(232, 99, 126, 0.5));
      }
    }

    .footer-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .footer-quote {
      font-size: 1.8rem;
      color: var(--rose-light);
      margin-bottom: 4px;
    }

    .footer-love-tag {
      font-size: 0.95rem;
      color: var(--text-muted);
    }

    .footer-date {
      font-size: 0.82rem;
      color: var(--gold-accent);
      letter-spacing: 1.5px;
      text-transform: uppercase;
      font-weight: 600;
    }

    .back-to-top-btn {
      margin-top: 20px;
      background: none;
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: var(--text-muted);
      padding: 8px 20px;
      border-radius: 9999px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        color: #fff;
        border-color: var(--rose-primary);
        background: rgba(232, 99, 126, 0.15);
        transform: translateY(-2px);
      }
    }
  `]
})
export class FooterSectionComponent {
  public scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
