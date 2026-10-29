import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TimelineEvent {
  date: string;
  badge: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
}

@Component({
  selector: 'app-love-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="historia" class="timeline-section" aria-label="Nuestra Historia">
      <div class="section-badge">
        <span class="badge-icon">⏳</span>
        <span>Nuestra Historia en Capítulos</span>
      </div>

      <h2 class="section-title">Los Momentos que nos Unieron</h2>
      <p class="section-subtitle">
        Cada paso que hemos dado juntos ha valido la pena. Así se escribe el libro de nuestras vidas.
      </p>

      <div class="timeline-container">
        <div class="timeline-line"></div>

        <div *ngFor="let item of events; let i = index" class="timeline-row" [class.row-inverted]="i % 2 === 1">
          <!-- Timeline Marker Node -->
          <div class="timeline-node">
            <span class="node-icon">{{ item.icon }}</span>
          </div>

          <!-- Timeline Card -->
          <div class="timeline-card glass-card">
            <div class="card-header">
              <span class="event-badge">{{ item.badge }}</span>
              <span class="event-date font-serif">{{ item.date }}</span>
            </div>
            
            <h3 class="event-title font-serif">{{ item.title }}</h3>
            
            @if (item.image) {
              <div class="timeline-img-box">
                <img [src]="item.image" [alt]="item.title" loading="lazy">
              </div>
            }

            <p class="event-desc">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .timeline-section {
      padding: 90px 20px;
      max-width: 1000px;
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
      margin: 0 auto 60px;
      font-size: 1.05rem;
      color: var(--text-muted);
      line-height: 1.7;
    }

    .timeline-container {
      position: relative;
      padding: 20px 0;
    }

    .timeline-line {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 2px;
      background: linear-gradient(
        to bottom,
        transparent,
        var(--rose-primary, #e8637e) 15%,
        var(--gold-accent, #e5b869) 85%,
        transparent 100%
      );
      box-shadow: 0 0 12px rgba(232, 99, 126, 0.4);
    }

    .timeline-row {
      display: flex;
      justify-content: flex-end;
      padding-right: calc(50% + 36px);
      position: relative;
      margin-bottom: 48px;

      &.row-inverted {
        justify-content: flex-start;
        padding-right: 0;
        padding-left: calc(50% + 36px);

        .timeline-card {
          text-align: left;
        }
      }
    }

    .timeline-node {
      position: absolute;
      top: 22px;
      left: 50%;
      transform: translate(-50%, 0);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #a02847 0%, #2f1222 100%);
      border: 2px solid var(--rose-light);
      box-shadow: 0 0 20px rgba(232, 99, 126, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      transition: transform 0.3s ease;

      .node-icon {
        font-size: 18px;
      }
    }

    .timeline-row:hover .timeline-node {
      transform: translate(-50%, 0) scale(1.15);
      border-color: var(--gold-accent);
    }

    .timeline-card {
      width: 100%;
      max-width: 440px;
      padding: 24px;
      text-align: left;
      position: relative;
      transition: all 0.35s ease;

      &:hover {
        transform: translateY(-4px);
        border-color: rgba(247, 162, 180, 0.45);
        box-shadow: 0 16px 36px rgba(0, 0, 0, 0.55), 0 0 25px rgba(232, 99, 126, 0.2);
      }
    }

    .timeline-img-box {
      width: 100%;
      height: 200px;
      border-radius: 12px;
      overflow: hidden;
      margin: 12px 0 14px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.4s ease;
      }

      &:hover img {
        transform: scale(1.05);
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .event-badge {
      font-size: 0.75rem;
      padding: 3px 10px;
      background: rgba(229, 184, 105, 0.15);
      border: 1px solid rgba(229, 184, 105, 0.3);
      color: var(--gold-accent);
      border-radius: 9999px;
      letter-spacing: 0.5px;
    }

    .event-date {
      font-size: 0.85rem;
      color: var(--rose-light);
      font-weight: 600;
    }

    .event-title {
      font-size: 1.4rem;
      color: #fff;
      margin-bottom: 10px;
      letter-spacing: -0.3px;
    }

    .event-desc {
      font-size: 0.95rem;
      color: var(--text-muted);
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .timeline-line {
        left: 28px;
      }

      .timeline-node {
        left: 28px;
      }

      .timeline-row, .timeline-row.row-inverted {
        justify-content: flex-start;
        padding-left: 72px;
        padding-right: 0;

        .timeline-card {
          text-align: left;
          max-width: 100%;
        }
      }
    }
  `]
})
export class LoveTimelineComponent {
  public events: TimelineEvent[] = [
    {
      date: 'El Comienzo',
      badge: 'Capítulo I',
      title: 'El día en que cruzamos miradas',
      description: 'El mundo seguía girando con normalidad para todos, pero para mí todo cambió cuando te conocí. Una simple conversación se convirtió en el inicio de mi historia favorita.',
      icon: '✨'
    },
    {
      date: 'Nuestra Primera Cita',
      badge: 'Capítulo II',
      title: 'Risas, nervios y magia',
      description: 'Esos nervios dulces en el estómago, las horas que volaron en minutos y esa sensación maravillosa de haber encontrado a la persona con la que puedo ser 100% yo mismo.',
      icon: '☕',
      image: 'photos/foto7.jpg'
    },
    {
      date: 'Complicidad Pura',
      badge: 'Capítulo III',
      title: 'Cuando entendí que eras tú',
      description: 'En cada abrazo que reinicia mi día, en cada broma que solo nosotros entendemos y en cada momento en silencio que se siente como el hogar más seguro.',
      icon: '💫'
    },
    {
      date: '26-27 de Octubre de 2025',
      badge: 'Nuestra Fecha Oficial',
      title: '¿Puedo ser tu novio? 💍',
      description: 'El día en que formalizamos nuestra historia. Con los nervios a flor de piel, el cartel azul que pinté con todo mi amor y la misteriosa almendra perdida, empezó la etapa más feliz de mi vida junto a ti, mi Pía Valentina.',
      icon: '🌹',
      image: 'photos/foto2.jpg'
    },
    {
      date: 'El Futuro Juntos',
      badge: 'Capítulo Infinito',
      title: 'Todo lo que aún nos queda por vivir',
      description: 'Viajes por hacer, canciones por cantar juntos a todo pulmón, metas por celebrar y miles de atardeceres esperando por nosotros. Esto recién empieza.',
      icon: '🌟'
    }
  ];
}
