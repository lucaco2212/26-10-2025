import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicService } from '../../services/music.service';

export interface LoveNote {
  id: string;
  category: 'open_when' | 'reasons';
  title: string;
  preview: string;
  message: string;
  emoji: string;
  colorTheme: string;
}

@Component({
  selector: 'app-love-capsules',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="mensajes" class="capsules-section" aria-label="Mensajitos y Cápsulas de Amor">
      <div class="section-badge">
        <span class="badge-icon">💌</span>
        <span>Mensajes para Cada Instante</span>
      </div>

      <h2 class="section-title">Cápsulas de Amor & "Abre Cuando..."</h2>
      <p class="section-subtitle">
        Pequeñas cartas y notas guardadas para ti. Elige la que tu corazón necesite abrir hoy.
      </p>

      <!-- Category Filter Tabs -->
      <div class="tabs-container">
        <button 
          class="tab-btn" 
          [class.active]="selectedCategory() === 'open_when'"
          (click)="selectedCategory.set('open_when')">
          <span>📬 Cartas "Abre cuando..."</span>
        </button>
        <button 
          class="tab-btn" 
          [class.active]="selectedCategory() === 'reasons'"
          (click)="selectedCategory.set('reasons')">
          <span>✨ Razones por las que te amo</span>
        </button>
      </div>

      <!-- Notes Grid -->
      <div class="notes-grid">
        <div 
          *ngFor="let note of filteredNotes()" 
          class="note-envelope-card glass-card"
          (click)="openNote(note)"
          tabindex="0"
          role="button"
          [attr.aria-label]="'Abrir: ' + note.title">
          
          <div class="card-icon-bubble" [style.background]="note.colorTheme">
            <span>{{ note.emoji }}</span>
          </div>

          <div class="card-content">
            <h3 class="note-title">{{ note.title }}</h3>
            <p class="note-preview font-handwriting">{{ note.preview }}</p>
          </div>

          <div class="card-action">
            <span class="action-text">Toca para abrir</span>
            <span class="action-arrow">→</span>
          </div>
        </div>
      </div>

      <!-- Note Detail Modal -->
      @if (activeNote()) {
        <div class="note-modal-backdrop" (click)="closeNote()">
          <div class="note-modal-content glass-card" (click)="$event.stopPropagation()">
            <button class="modal-close" (click)="closeNote()" aria-label="Cerrar mensaje">✕</button>

            <div class="modal-emoji-header">
              <span class="floating-emoji">{{ activeNote()?.emoji }}</span>
            </div>

            <h3 class="modal-note-title font-serif">{{ activeNote()?.title }}</h3>

            <div class="modal-letter-sheet font-handwriting">
              <p class="modal-note-text">
                {{ activeNote()?.message }}
              </p>
            </div>

            <div class="modal-note-footer">
              <span class="reminder-text">Siempre estaré aquí para ti ❤️</span>
              <button class="btn-romantic" (click)="closeNote()">
                <span>Guardar en el corazón</span>
              </button>
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styles: [`
    .capsules-section {
      padding: 90px 20px;
      max-width: 1100px;
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
      max-width: 600px;
      margin: 0 auto 36px;
      font-size: 1.05rem;
      color: var(--text-muted);
      line-height: 1.7;
    }

    /* Tabs */
    .tabs-container {
      display: inline-flex;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 6px;
      border-radius: 9999px;
      margin-bottom: 45px;
      gap: 6px;
    }

    .tab-btn {
      background: none;
      border: none;
      padding: 10px 24px;
      border-radius: 9999px;
      color: var(--text-muted);
      font-family: var(--font-sans);
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;

      &.active {
        background: linear-gradient(135deg, var(--rose-primary), #a02847);
        color: #fff;
        box-shadow: 0 4px 15px var(--rose-glow);
      }

      &:hover:not(.active) {
        color: #fff;
        background: rgba(255, 255, 255, 0.08);
      }
    }

    /* Notes Grid */
    .notes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
      gap: 24px;
      text-align: left;
    }

    .note-envelope-card {
      padding: 24px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 18px;
      position: relative;
      overflow: hidden;
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, transparent, var(--rose-primary), transparent);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover {
        transform: translateY(-6px);
        border-color: rgba(247, 162, 180, 0.4);
        box-shadow: 0 18px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(232, 99, 126, 0.25);

        &::after {
          opacity: 1;
        }

        .action-arrow {
          transform: translateX(4px);
        }
      }
    }

    .card-icon-bubble {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .card-content {
      .note-title {
        font-size: 1.25rem;
        color: #fff;
        margin-bottom: 8px;
        font-weight: 600;
      }

      .note-preview {
        font-size: 1.25rem;
        color: var(--text-muted);
        line-height: 1.35;
      }
    }

    .card-action {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 14px;
      font-size: 0.85rem;
      color: var(--rose-light);
      font-weight: 600;

      .action-arrow {
        font-size: 1.1rem;
        transition: transform 0.2s ease;
      }
    }

    /* Modal */
    .note-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(10, 5, 14, 0.88);
      backdrop-filter: blur(14px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn 0.3s ease;
    }

    .note-modal-content {
      width: 100%;
      max-width: 540px;
      padding: 36px 30px 28px;
      text-align: center;
      position: relative;
      background: linear-gradient(160deg, rgba(32, 17, 38, 0.95) 0%, rgba(20, 10, 24, 0.98) 100%);
      border: 1px solid rgba(247, 162, 180, 0.35);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(232, 99, 126, 0.3);
      animation: popIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .modal-close {
      position: absolute;
      top: 16px;
      right: 18px;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: #fff;
      font-size: 18px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease;

      &:hover {
        background: var(--rose-primary);
      }
    }

    .floating-emoji {
      font-size: 50px;
      display: inline-block;
      margin-bottom: 12px;
      filter: drop-shadow(0 6px 15px rgba(232, 99, 126, 0.4));
      animation: bounceGentle 2s infinite ease-in-out;
    }

    @keyframes bounceGentle {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    .modal-note-title {
      font-size: 1.8rem;
      color: #fff;
      margin-bottom: 20px;
    }

    .modal-letter-sheet {
      background: #fbf5ed;
      color: #2b1820;
      padding: 26px 22px;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
      margin-bottom: 24px;
      border-left: 4px solid var(--rose-primary);
    }

    .modal-note-text {
      font-size: 1.55rem;
      line-height: 1.5;
      text-align: left;
      white-space: pre-line;
    }

    .modal-note-footer {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;

      .reminder-text {
        font-size: 0.9rem;
        color: var(--rose-light);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes popIn {
      from { transform: scale(0.92) translateY(20px); opacity: 0; }
      to { transform: scale(1) translateY(0); opacity: 1; }
    }
  `]
})
export class LoveCapsulesComponent {
  private music = inject(MusicService);

  public selectedCategory = signal<'open_when' | 'reasons'>('open_when');
  public activeNote = signal<LoveNote | null>(null);

  private notesList: LoveNote[] = [
    // Open When...
    {
      id: 'ow-1',
      category: 'open_when',
      title: 'Abre cuando me extrañes',
      preview: 'Cierra los ojos un segundo y siente este abrazo...',
      message: 'Si me estás extrañando ahora mismo, quiero que pongas tu mano en tu corazón y respires profundo. Ahí estoy yo contigo. Cada latido es un recordatorio de que no importa la distancia ni la hora, mi amor te acompaña en cada paso. Eres mi pensamiento favorito de cada día.',
      emoji: '🧸',
      colorTheme: 'rgba(232, 99, 126, 0.25)'
    },
    {
      id: 'ow-2',
      category: 'open_when',
      title: 'Abre cuando hayas tenido un día difícil',
      preview: 'Todo va a estar bien, eres más fuerte de lo que crees...',
      message: 'Sé que hay días pesados donde las cosas no salen como esperabas. Pero quiero recordarte lo increíble, capaz y maravillosa persona que eres. Deja ir la carga, date un respiro y no olvides que estoy en tu equipo para siempre. Mañana será un día mejor y yo estaré ahí para celebrarlo.',
      emoji: '🍵',
      colorTheme: 'rgba(229, 184, 105, 0.25)'
    },
    {
      id: 'ow-3',
      category: 'open_when',
      title: 'Abre cuando no puedas dormir',
      preview: 'Deja que mis palabras te arrullen en silencio...',
      message: 'Si la noche se siente muy larga y tus pensamientos no descansan, piensa en nosotros caminando despacio, mirando las estrellas sin ninguna prisa. Imagina mi mano sosteniendo la tuya y quédate con esta certeza: eres profundamente amada y estás a salvo.',
      emoji: '🌙',
      colorTheme: 'rgba(147, 112, 219, 0.25)'
    },
    {
      id: 'ow-4',
      category: 'open_when',
      title: 'Abre cuando quieras sonreír',
      preview: 'Un recordatorio de lo mucho que ilumina tu risa...',
      message: '¿Sabías que cuando sonríes tus ojos brillan de una forma que hace que el mundo entero se vuelva más bonito? Si necesitabas una razón para sonreír, piensa en todas las tonterías de las que nos reímos juntos y en la cara de enamorado que pongo cada vez que te miro.',
      emoji: '✨',
      colorTheme: 'rgba(255, 182, 193, 0.25)'
    },
    {
      id: 'ow-5',
      category: 'open_when',
      title: 'Abre cuando dudes de ti misma',
      preview: 'Ojalá pudieras verte a través de mis ojos...',
      message: 'Si alguna vez dudas de tu valor, tu talento o tu belleza, ojalá pudieras prestarte mis ojos por cinco minutos. Verías a una mujer con una luz deslumbrante, con una ternura infinita y una valentía que me inspira a ser mejor todos los días. Eres arte.',
      emoji: '💎',
      colorTheme: 'rgba(229, 184, 105, 0.25)'
    },
    {
      id: 'ow-6',
      category: 'open_when',
      title: 'Abre cuando celebres un gran logro',
      preview: '¡Estoy inmensamente orgulloso de ti!',
      message: '¡Te lo dije! Sabía que lo lograrías. Nadie merece más las cosas buenas de la vida que tú, por todo tu esfuerzo, tu pasión y tu dedicación. Levanta los brazos, sonríe y siéntete orgullosa, porque este triunfo es solo uno de los miles que vendrán.',
      emoji: '🎉',
      colorTheme: 'rgba(255, 215, 0, 0.25)'
    },

    // Reasons why I love you
    {
      id: 'r-1',
      category: 'reasons',
      title: 'Por cómo me miras',
      preview: 'Esa mirada en la que me siento completamente en casa...',
      message: 'Amo la manera en que tus ojos se encuentran con los míos en una habitación llena de gente, y en ese segundo siento como si no existiera nadie más en el mundo. Hay una paz inigualable en tu mirada.',
      emoji: '👀',
      colorTheme: 'rgba(232, 99, 126, 0.25)'
    },
    {
      id: 'r-2',
      category: 'reasons',
      title: 'Por tu risa contagiosa',
      preview: 'El mejor sonido que existe en mi universo...',
      message: 'Tu risa espontánea, esa que se te escapa de la nada cuando algo te da mucha gracia, tiene el poder curativo de borrar cualquier preocupación. Haces que todo sea más ligero y feliz.',
      emoji: '🎵',
      colorTheme: 'rgba(247, 162, 180, 0.25)'
    },
    {
      id: 'r-3',
      category: 'reasons',
      title: 'Por tu corazón bondadoso',
      preview: 'La gentileza con la que tratas al mundo...',
      message: 'Me enamora la empatía que tienes, cómo te preocupas por los que quieres y la pureza con la que sientes las cosas. Tienes un corazón de oro que hace que el mundo sea un lugar más cálido.',
      emoji: '💛',
      colorTheme: 'rgba(229, 184, 105, 0.25)'
    },
    {
      id: 'r-4',
      category: 'reasons',
      title: 'Por ser mi refugio seguro',
      preview: 'El lugar al que siempre quiero regresar...',
      message: 'No importa lo caótico que sea el día a día, estar contigo me da la tranquilidad más profunda. En tus abrazos todo encaja y cualquier tormenta se calma.',
      emoji: '🏡',
      colorTheme: 'rgba(147, 112, 219, 0.25)'
    },
    {
      id: 'r-5',
      category: 'reasons',
      title: 'Por nuestras charlas infinitas',
      preview: 'De temas profundos a tonterías sin sentido...',
      message: 'Amo que podamos pasar horas conversando sobre la vida, el futuro, recuerdos, o simplemente inventando tonterías y riéndonos sin parar. Nunca me canso de escucharte.',
      emoji: '☕',
      colorTheme: 'rgba(232, 99, 126, 0.25)'
    },
    {
      id: 'r-6',
      category: 'reasons',
      title: 'Simplemente por ser tú',
      preview: 'Exactamente tal como eres, perfecta para mí...',
      message: 'Te amo con tus virtudes, con tus manías tiernas, con tus sueños y con tu manera única de ver la vida. No cambiaría absolutamente nada de ti. Eres mi persona favorita.',
      emoji: '🌹',
      colorTheme: 'rgba(229, 184, 105, 0.25)'
    }
  ];

  public filteredNotes(): LoveNote[] {
    return this.notesList.filter(n => n.category === this.selectedCategory());
  }

  public openNote(note: LoveNote): void {
    this.activeNote.set(note);
    this.music.playChimeSound();
  }

  public closeNote(): void {
    this.activeNote.set(null);
  }
}
