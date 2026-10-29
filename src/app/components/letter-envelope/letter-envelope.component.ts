import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicService } from '../../services/music.service';

@Component({
  selector: 'app-letter-envelope',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="carta" class="letter-section" aria-label="Nuestra Carta">
      <div class="section-badge">
        <span class="badge-icon">💌</span>
        <span>Palabras desde lo más profundo del corazón</span>
      </div>

      <h2 class="section-title">Nuestra Carta</h2>
      <p class="section-subtitle">
        esta carta describe lo que senti el dia de hoy
      </p>

      <!-- Envelope & Letter Interactive Container -->
      <div class="envelope-stage">
        <!-- Interactive Envelope -->
        <div 
          class="envelope-wrapper" 
          [class.is-open]="isOpen()" 
          (click)="handleEnvelopeClick()"
          role="button"
          tabindex="0"
          [attr.aria-label]="isOpen() ? 'Carta abierta' : 'Toca el sello para abrir la carta'">
          
          <div class="envelope">
            <!-- Back flap -->
            <div class="envelope-back"></div>

            <!-- Letter sheet inside -->
            <div class="letter-preview" [class.letter-slide]="isOpen()" (click)="$event.stopPropagation(); openFullModal()">
              <div class="letter-header">
                <span class="letter-date">26-27 de Octubre de 2025</span>
                <span class="letter-stamp">✨ Para Pía Valentina</span>
              </div>
              <div class="letter-content font-handwriting">
                <p class="salutation">{{ letterSalutation() }}</p>
                <p class="letter-body">
                  {{ letterSnippet() }}
                </p>
                <div class="read-more-hint">
                  <span>Haz clic aquí para leer la carta completa</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  </svg>
                </div>
              </div>
              <div class="letter-signature font-handwriting">
                <span>Siempre tuyo,</span>
                <strong>{{ letterSender() }}</strong>
              </div>
            </div>

            <!-- Front folds -->
            <div class="envelope-pocket"></div>
            <div class="envelope-flap"></div>

            <!-- Wax Seal -->
            <div class="wax-seal" [class.seal-broken]="isOpen()" title="Toca el sello para abrir">
              <div class="seal-inner">
                <span class="seal-symbol">❤️</span>
              </div>
              <div class="seal-shimmer"></div>
            </div>
          </div>
        </div>

        <div class="envelope-action-buttons">
          @if (!isOpen()) {
            <p class="envelope-instruction">
              <span class="pulse-sparkle">✨</span> Toca el sello de cera para abrir la carta
            </p>
          } @else {
            <div class="envelope-opened-actions">
              <button class="btn-romantic" (click)="openFullModal()">
                <span>📜 Leer carta completa</span>
              </button>
              <button class="btn-secondary-romantic" (click)="isOpen.set(false)">
                <span>Cerrar sobre</span>
              </button>
            </div>
          }
        </div>
      </div>

      <!-- Full Screen Reading Modal -->
      @if (showFullModal()) {
        <div class="modal-backdrop" (click)="showFullModal.set(false)">
          <div class="letter-modal-paper glass-card" (click)="$event.stopPropagation()">
            <button class="modal-close-btn" (click)="showFullModal.set(false)" aria-label="Cerrar carta">✕</button>
            
            <div class="modal-paper-texture">
              <div class="modal-letter-header">
                <span class="modal-date">26-27 · Octubre · 2025</span>
                <span class="modal-tag">💌 Para Pía Valentina</span>
              </div>

              <div class="modal-letter-body font-handwriting">
                <h3 class="modal-salutation">{{ letterSalutation() }}</h3>
                <div class="modal-paragraphs">
                  <p *ngFor="let paragraph of getParagraphs()">
                    {{ paragraph }}
                  </p>
                </div>
                <div class="modal-signature">
                  <p>Con todo mi corazón hoy y siempre,</p>
                  <strong>{{ letterSender() }}</strong>
                </div>
              </div>

              <div class="modal-footer">
                <button class="btn-romantic" (click)="showFullModal.set(false)">
                  <span>Cerrar con una sonrisa ❤️</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styles: [`
    .letter-section {
      padding: 90px 20px 80px;
      max-width: 900px;
      margin: 0 auto;
      text-align: center;
      position: relative;
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

    .section-title {
      font-family: var(--font-serif);
      font-size: clamp(2rem, 5vw, 3.2rem);
      font-weight: 700;
      color: #fff;
      margin-bottom: 14px;
      letter-spacing: -0.5px;
    }

    .section-subtitle {
      max-width: 620px;
      margin: 0 auto 50px;
      font-size: 1.05rem;
      color: var(--text-muted);
      line-height: 1.7;
    }

    /* Envelope Stage */
    .envelope-stage {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    .envelope-wrapper {
      position: relative;
      width: 360px;
      max-width: 92vw;
      height: 240px;
      cursor: pointer;
      perspective: 1200px;
      margin-bottom: 40px;
      transition: transform 0.4s ease;

      &:hover:not(.is-open) {
        transform: translateY(-6px) scale(1.02);
      }
    }

    .envelope {
      position: relative;
      width: 100%;
      height: 100%;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.55);
      border-radius: 8px;
    }

    .envelope-back {
      position: absolute;
      inset: 0;
      background: linear-gradient(145deg, #2a1420 0%, #1e0e17 100%);
      border-radius: 8px;
      border: 1px solid rgba(247, 162, 180, 0.2);
    }

    .envelope-pocket {
      position: absolute;
      inset: 0;
      z-index: 3;
      pointer-events: none;
      clip-path: polygon(0% 100%, 50% 48%, 100% 100%, 100% 0%, 0% 0%);
      transform: rotate(180deg);
      background: linear-gradient(160deg, #381a29 0%, #25101c 100%);
      border-radius: 8px;
      border-top: 1px solid rgba(255, 200, 220, 0.25);
    }

    .envelope-flap {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      clip-path: polygon(0% 0%, 100% 0%, 50% 55%);
      background: linear-gradient(180deg, #421e31 0%, #2b1321 100%);
      transform-origin: top center;
      transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 5;
      border-top: 1px solid rgba(255, 200, 220, 0.3);
    }

    .envelope-wrapper.is-open .envelope-flap {
      transform: rotateX(180deg);
      z-index: 1;
    }

    /* Wax Seal */
    .wax-seal {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -10%);
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #b62340 0%, #7d1127 75%, #4f0a17 100%);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 6;
      transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      border: 2px solid rgba(229, 184, 105, 0.6);

      .seal-symbol {
        font-size: 22px;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
      }

      &.seal-broken {
        opacity: 0;
        transform: translate(-50%, -60px) scale(0.6);
        pointer-events: none;
      }
    }

    /* Letter inside sliding out */
    .letter-preview {
      position: absolute;
      top: 10px;
      left: 14px;
      right: 14px;
      bottom: 10px;
      background: #fbf5ed;
      color: #2b1a20;
      border-radius: 6px;
      padding: 22px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
      z-index: 2;
      transition: transform 0.9s cubic-bezier(0.34, 1.3, 0.64, 1), box-shadow 0.5s ease;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: left;
      overflow: hidden;

      &.letter-slide {
        transform: translateY(-135px);
        z-index: 4;
        box-shadow: 0 25px 45px rgba(0, 0, 0, 0.6);
        cursor: pointer;

        &:hover {
          transform: translateY(-145px) scale(1.02);
        }
      }
    }

    .letter-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #8c6875;
      font-family: var(--font-sans);
      border-bottom: 1px dashed rgba(140, 104, 117, 0.3);
      padding-bottom: 6px;
      margin-bottom: 8px;
    }

    .letter-content {
      flex: 1;

      .salutation {
        font-size: 1.45rem;
        font-weight: 700;
        color: #63172e;
        margin-bottom: 6px;
      }

      .letter-body {
        font-size: 1.25rem;
        line-height: 1.45;
        color: #3b2730;
      }

      .read-more-hint {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-top: 10px;
        font-size: 0.85rem;
        font-family: var(--font-sans);
        color: #a02847;
        font-weight: 600;
        text-decoration: underline;
      }
    }

    .letter-signature {
      margin-top: 10px;
      text-align: right;
      font-size: 1.25rem;
      color: #63172e;
      display: flex;
      flex-direction: column;

      span {
        font-size: 1rem;
        color: #8c6875;
      }
    }

    .envelope-instruction {
      font-size: 1.05rem;
      color: var(--rose-light);
      margin-top: 15px;
      animation: pulseText 2s infinite ease-in-out;
    }

    @keyframes pulseText {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 1; transform: scale(1.02); }
    }

    .envelope-opened-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
      margin-top: 25px;
    }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(10, 5, 14, 0.85);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn 0.3s ease;
    }

    .letter-modal-paper {
      position: relative;
      max-width: 680px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      background: #fbf5ed;
      color: #2b1a20;
      border-radius: 12px;
      padding: 40px 34px 30px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);
      border: 1px solid rgba(229, 184, 105, 0.4);
      animation: modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .modal-close-btn {
      position: absolute;
      top: 16px;
      right: 18px;
      background: rgba(140, 50, 75, 0.15);
      border: none;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 18px;
      color: #63172e;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease;

      &:hover {
        background: rgba(140, 50, 75, 0.3);
      }
    }

    .modal-letter-header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px dashed rgba(140, 104, 117, 0.35);
      padding-bottom: 12px;
      margin-bottom: 24px;
      font-family: var(--font-sans);
      font-size: 0.9rem;
      color: #8c6875;
    }

    .modal-salutation {
      font-size: 2.2rem;
      color: #63172e;
      margin-bottom: 18px;
    }

    .modal-paragraphs {
      font-size: 1.55rem;
      line-height: 1.6;
      color: #3b2730;
      display: flex;
      flex-direction: column;
      gap: 16px;
      text-align: left;
    }

    .modal-signature {
      margin-top: 32px;
      text-align: right;
      font-size: 1.65rem;
      color: #63172e;

      p {
        font-size: 1.3rem;
        color: #8c6875;
      }
    }

    .modal-footer {
      margin-top: 30px;
      text-align: center;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes modalSlideUp {
      from { transform: translateY(40px) scale(0.96); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }

    @media (max-width: 600px) {
      .letter-preview.letter-slide {
        transform: translateY(-95px);
      }
      .letter-modal-paper {
        padding: 30px 20px 20px;
      }
      .modal-paragraphs {
        font-size: 1.35rem;
      }
    }
  `]
})
export class LetterEnvelopeComponent {
  private music = inject(MusicService);

  public isOpen = signal<boolean>(false);
  public showFullModal = signal<boolean>(false);

  public letterSalutation = signal<string>('Para mi amor, Pía Valentina:');
  public letterFullContent = signal<string>(
    `Hoy fue un día espectacular en el que cumplí la meta de formalizar nuestra relación con la persona que amo, Pía Valentina.\n\n` +
    `Es un poco loco estar escribiéndote esto hoy (26-27/10/2025), ya que quiero regalarte esta página en un día especial. Probablemente te la esté entregando en nuestro aniversario.\n\n` +
    `Quizás sea un poco pronto para decírtelo, pero…\n\n` +
    `De verdad te amo mucho, Pía. Hoy no solo formalizamos, sino que también me declaro culpable de amarte. Hoy mi estómago estaba vuelto loco; estaba demasiado nervioso de preguntarte si podía ser tu novio (aunque probablemente lo más loco fue no saber a dónde se fue la almendra, ¡jajaja!).\n\n` +
    `Te amo tanto, Pía. Quiero que sepas que antes de ti no tenía ninguna fe en el amor, y que hoy me haya arriesgado a entregarte lo que siento significa muchísimo para mí. No solo te estoy entregando mi amor, sino también la lealtad y el respeto que mereces. De verdad eres lo que estuve buscando toda la vida.\n\n` +
    `Espero que sigamos juntos por siempre y también espero entregarte pronto esta página, a la que le dediqué tanto esfuerzo (fueron alrededor de 5 horas de trabajo).`
  );
  public letterSender = signal<string>('Tu novio, Toñito ❤️');

  constructor() {
    this.loadSavedLetter();
  }

  public handleEnvelopeClick(): void {
    this.isOpen.set(true);
    this.showFullModal.set(true);
    this.music.playChimeSound();
  }

  public openFullModal(): void {
    this.showFullModal.set(true);
    this.music.playChimeSound();
  }

  public letterSnippet(): string {
    const full = this.letterFullContent();
    return full.length > 130 ? full.slice(0, 130) + '...' : full;
  }

  public getParagraphs(): string[] {
    return this.letterFullContent().split('\n\n').filter(p => p.trim().length > 0);
  }

  public saveLetterData(): void {
    try {
      localStorage.setItem('letter_salutation_v2', this.letterSalutation());
      localStorage.setItem('letter_content_v2', this.letterFullContent());
      localStorage.setItem('letter_sender_v2', this.letterSender());
    } catch (e) {
      // ignore
    }
  }

  private loadSavedLetter(): void {
    try {
      const s = localStorage.getItem('letter_salutation_v2');
      const c = localStorage.getItem('letter_content_v2');
      const sender = localStorage.getItem('letter_sender_v2');
      if (s) this.letterSalutation.set(s);
      if (c) this.letterFullContent.set(c);
      if (sender) this.letterSender.set(sender);
    } catch (e) {
      // ignore
    }
  }
}
