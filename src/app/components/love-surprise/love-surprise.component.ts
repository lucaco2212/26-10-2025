import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicService } from '../../services/music.service';

interface FloatingHeartItem {
  id: number;
  x: number;
  y: number;
  size: number;
  emoji: string;
}

@Component({
  selector: 'app-love-surprise',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="surprise-section" aria-label="Sorpresa de Amor">
      <div class="surprise-card glass-card">
        <span class="sparkle-badge">✨ Un rincón especial</span>
        <h2 class="surprise-title font-serif">El Botón del Amor Infinito</h2>
        <p class="surprise-desc">
          Cuando sientas que me extrañas o simplemente necesites una dosis extra de ternura, toca este corazón.
        </p>

        <!-- Big Pulsing Heart Button -->
        <button 
          class="heart-pulse-btn" 
          (click)="handleHeartClick($event)"
          aria-label="Presiona para recibir amor">
          <span class="heart-symbol animate-pulse-heart">❤️</span>
          <span class="btn-ripple"></span>
        </button>

        <!-- Current Romantic Whisper -->
        @if (currentWhisper()) {
          <div class="whisper-box font-handwriting">
            <span class="quote-mark">“</span>
            <p class="whisper-text">{{ currentWhisper() }}</p>
            <span class="quote-mark">”</span>
          </div>
        }

        <!-- Virtual hugs counter -->
        <div class="hugs-badge">
          <span class="hugs-icon">🫂</span>
          <span><strong>{{ hugCount() }}</strong> abrazos virtuales enviados con amor</span>
        </div>
      </div>

      <!-- Confetti hearts explosion container -->
      <div class="floating-hearts-layer" *ngIf="floatingHearts().length > 0">
        <span 
          *ngFor="let h of floatingHearts()" 
          class="floating-heart"
          [style.left.px]="h.x"
          [style.top.px]="h.y"
          [style.font-size.px]="h.size">
          {{ h.emoji }}
        </span>
      </div>
    </section>
  `,
  styles: [`
    .surprise-section {
      padding: 60px 20px 100px;
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
      position: relative;
    }

    .surprise-card {
      padding: 50px 30px;
      border: 1px solid rgba(247, 162, 180, 0.35);
      background: radial-gradient(circle at 50% 30%, rgba(55, 20, 38, 0.8) 0%, rgba(20, 10, 24, 0.95) 100%);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(232, 99, 126, 0.25);
      border-radius: var(--radius-lg);
      position: relative;
      overflow: hidden;
    }

    .sparkle-badge {
      display: inline-block;
      font-size: 0.85rem;
      color: var(--gold-accent);
      margin-bottom: 12px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .surprise-title {
      font-size: clamp(2rem, 4vw, 2.8rem);
      color: #fff;
      margin-bottom: 12px;
    }

    .surprise-desc {
      font-size: 1.05rem;
      color: var(--text-muted);
      max-width: 520px;
      margin: 0 auto 36px;
      line-height: 1.6;
    }

    .heart-pulse-btn {
      background: none;
      border: none;
      cursor: pointer;
      position: relative;
      width: 110px;
      height: 110px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(232, 99, 126, 0.25) 0%, transparent 70%);
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);

      &:hover {
        transform: scale(1.1);
      }

      &:active {
        transform: scale(0.92);
      }

      .heart-symbol {
        font-size: 56px;
        display: block;
        filter: drop-shadow(0 0 20px rgba(232, 99, 126, 0.7));
      }
    }

    .whisper-box {
      margin-top: 30px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px dashed rgba(247, 162, 180, 0.4);
      border-radius: 16px;
      padding: 22px 28px;
      max-width: 560px;
      margin-left: auto;
      margin-right: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      animation: popWhisper 0.4s cubic-bezier(0.16, 1, 0.3, 1);

      .quote-mark {
        font-size: 2.2rem;
        color: var(--gold-accent);
        line-height: 1;
      }

      .whisper-text {
        font-size: 1.55rem;
        color: #fff;
        line-height: 1.4;
      }
    }

    @keyframes popWhisper {
      from { transform: translateY(12px) scale(0.95); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }

    .hugs-badge {
      margin-top: 28px;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 0.95rem;
      color: var(--text-muted);
      background: rgba(0, 0, 0, 0.3);
      padding: 8px 20px;
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.08);

      strong {
        color: var(--rose-light);
      }
    }

    /* Floating hearts explosion */
    .floating-hearts-layer {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9999;
    }

    .floating-heart {
      position: absolute;
      animation: floatBurst 1.8s ease-out forwards;
      filter: drop-shadow(0 4px 10px rgba(232, 99, 126, 0.6));
    }

    @keyframes floatBurst {
      0% {
        transform: translate(0, 0) scale(0.5);
        opacity: 1;
      }
      100% {
        transform: translate(var(--rand-x, 0px), -180px) scale(1.4);
        opacity: 0;
      }
    }
  `]
})
export class LoveSurpriseComponent {
  private music = inject(MusicService);

  public hugCount = signal<number>(26);
  public currentWhisper = signal<string>('Eres la coincidencia más hermosa de mi vida.');
  public floatingHearts = signal<FloatingHeartItem[]>([]);

  private whispers: string[] = [
    'Eres mi persona favorita en todo el universo.',
    'Gracias por existir y por llenar mis días de sonrisas.',
    'No hay rincón en el mundo donde me sienta más seguro que en tus brazos.',
    'Tu risa es la melodía que siempre quiero escuchar.',
    'Te amo hoy más que ayer y muchísimo menos que mañana.',
    'Eres el regalo más bonito que la vida me pudo dar.',
    'Cada momento contigo vale por mil vidas.',
    'Tú eres mi hogar, hoy, mañana y siempre.',
    'Haces que cada día ordinario se sienta extraordinario.'
  ];

  private emojis = ['❤️', '💖', '✨', '🌹', '🥰', '💕', '💫', '🧸'];

  constructor() {
    this.loadHugCount();
  }

  public handleHeartClick(event: MouseEvent): void {
    this.hugCount.update(c => c + 1);
    this.saveHugCount();
    this.music.playChimeSound();

    // Random whisper
    const randomIdx = Math.floor(Math.random() * this.whispers.length);
    this.currentWhisper.set(this.whispers[randomIdx]);

    // Spawn floating hearts burst around click
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    const newHearts: FloatingHeartItem[] = [];
    for (let i = 0; i < 14; i++) {
      const offsetX = (Math.random() - 0.5) * 160;
      const offsetY = (Math.random() - 0.5) * 40;
      newHearts.push({
        id: Date.now() + i,
        x: originX + offsetX,
        y: originY + offsetY,
        size: Math.random() * 16 + 22,
        emoji: this.emojis[Math.floor(Math.random() * this.emojis.length)]
      });
    }

    this.floatingHearts.set(newHearts);

    setTimeout(() => {
      this.floatingHearts.set([]);
    }, 1800);
  }

  private saveHugCount(): void {
    try {
      localStorage.setItem('hug_count', this.hugCount().toString());
    } catch (e) {}
  }

  private loadHugCount(): void {
    try {
      const saved = localStorage.getItem('hug_count');
      if (saved) {
        this.hugCount.set(parseInt(saved, 10));
      }
    } catch (e) {}
  }
}
