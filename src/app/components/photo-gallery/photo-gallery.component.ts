import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MusicService } from '../../services/music.service';

export interface PolaroidPhoto {
  id: string;
  url: string;
  caption: string;
  date: string;
  location?: string;
  rotation: number;
}

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="fotos" class="gallery-section" aria-label="Nuestros Recuerdos">
      <div class="section-badge">
        <span class="badge-icon">📸</span>
        <span>Momentos que guardo en el corazón</span>
      </div>

      <h2 class="section-title">Galería de Recuerdos</h2>
      <p class="section-subtitle">
        Cada fotografía es una pausa en el tiempo donde fuimos infinitamente felices.
      </p>

      <div class="gallery-controls">
        <button class="btn-secondary-romantic" (click)="openCustomizer()">
          <span>📷 Cambiar o subir fotos</span>
        </button>
      </div>

      <!-- Polaroid Grid -->
      <div class="polaroid-grid">
        <div 
          *ngFor="let photo of photos(); let i = index" 
          class="polaroid-card"
          [style.transform]="'rotate(' + photo.rotation + 'deg)'"
          (click)="openLightbox(i)"
          tabindex="0"
          role="button"
          [attr.aria-label]="'Ver recuerdo: ' + photo.caption">
          
          <!-- Decorative Washi Tape -->
          <div class="washi-tape" [class.tape-gold]="i % 2 === 1"></div>

          <!-- Photo Image Box -->
          <div class="polaroid-img-wrapper">
            <img [src]="photo.url" [alt]="photo.caption" loading="lazy" (error)="onImgError($event, i)">
            <div class="photo-overlay-glass">
              <span class="view-heart">❤️</span>
            </div>
          </div>

          <!-- Handwritten Caption -->
          <div class="polaroid-caption font-handwriting">
            <span class="caption-text">{{ photo.caption }}</span>
            <span class="caption-date font-serif">{{ photo.date }}</span>
          </div>
        </div>
      </div>

      <!-- Lightbox Modal -->
      @if (activePhotoIndex() !== null) {
        <div class="lightbox-overlay" (click)="closeLightbox()">
          <div class="lightbox-content" (click)="$event.stopPropagation()">
            <button class="lightbox-close" (click)="closeLightbox()" aria-label="Cerrar vista ampliada">✕</button>
            
            <button class="lightbox-nav nav-prev" (click)="prevPhoto()" aria-label="Foto anterior">❮</button>
            <button class="lightbox-nav nav-next" (click)="nextPhoto()" aria-label="Foto siguiente">❯</button>

            <div class="lightbox-polaroid">
              <div class="lightbox-img-frame">
                <img [src]="currentActivePhoto()?.url" [alt]="currentActivePhoto()?.caption">
              </div>
              <div class="lightbox-info font-handwriting">
                <h3 class="lightbox-title">{{ currentActivePhoto()?.caption }}</h3>
                <div class="lightbox-meta font-serif">
                  <span>📅 {{ currentActivePhoto()?.date }}</span>
                  <span *ngIf="currentActivePhoto()?.location">📍 {{ currentActivePhoto()?.location }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Photo Manager / Customizer Modal -->
      @if (showCustomizer()) {
        <div class="customizer-overlay" (click)="showCustomizer.set(false)">
          <div class="customizer-modal glass-card" (click)="$event.stopPropagation()">
            <div class="customizer-header">
              <h3>Personalizar Fotografías</h3>
              <button class="close-btn" (click)="showCustomizer.set(false)">✕</button>
            </div>
            <p class="customizer-desc">
              Puedes subir tus fotos reales directamente desde tu computadora o teléfono. ¡Se guardarán en tu navegador al instante!
            </p>

            <div class="customizer-list">
              <div *ngFor="let photo of photos(); let i = index" class="customizer-item">
                <div class="item-thumb">
                  <img [src]="photo.url" alt="preview">
                </div>
                <div class="item-fields">
                  <label class="upload-btn-label">
                    <span>📁 Subir imagen propia (Foto {{ i + 1 }})</span>
                    <input type="file" accept="image/*" (change)="onFileUpload($event, i)">
                  </label>
                  <input type="text" [(ngModel)]="photo.caption" placeholder="Título / Frase linda" (ngModelChange)="savePhotos()">
                  <input type="text" [(ngModel)]="photo.date" placeholder="Fecha del recuerdo" (ngModelChange)="savePhotos()">
                </div>
              </div>
            </div>

            <div class="customizer-footer">
              <button class="btn-secondary-romantic" (click)="resetDefaultPhotos()">
                <span>Restaurar fotos originales</span>
              </button>
              <button class="btn-romantic" (click)="showCustomizer.set(false)">
                <span>Listo ❤️</span>
              </button>
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styles: [`
    .gallery-section {
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
      margin: 0 auto 35px;
      font-size: 1.05rem;
      color: var(--text-muted);
      line-height: 1.7;
    }

    .gallery-controls {
      margin-bottom: 45px;
    }

    /* Polaroid Grid */
    .polaroid-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 36px 28px;
      padding: 20px 10px;
      justify-items: center;
    }

    .polaroid-card {
      position: relative;
      background: #fdfaf6;
      padding: 14px 14px 22px;
      border-radius: 4px;
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5), 0 2px 6px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      width: 100%;
      max-width: 270px;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

      &:hover {
        transform: rotate(0deg) translateY(-12px) scale(1.05) !important;
        box-shadow: 0 24px 45px rgba(0, 0, 0, 0.7), 0 0 25px rgba(232, 99, 126, 0.35);
        z-index: 10;

        .photo-overlay-glass {
          opacity: 1;
        }
      }
    }

    /* Washi tape decoration */
    .washi-tape {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 22px;
      background: rgba(247, 162, 180, 0.75);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      clip-path: polygon(4% 0%, 96% 0%, 100% 100%, 0% 100%);
      opacity: 0.85;

      &.tape-gold {
        background: rgba(229, 184, 105, 0.7);
        width: 75px;
      }
    }

    .polaroid-img-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      overflow: hidden;
      border-radius: 2px;
      background: #1a121d;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.6s ease;
      }
    }

    .polaroid-card:hover .polaroid-img-wrapper img {
      transform: scale(1.05);
    }

    .photo-overlay-glass {
      position: absolute;
      inset: 0;
      background: rgba(140, 30, 60, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;

      .view-heart {
        font-size: 28px;
        filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6));
      }
    }

    .polaroid-caption {
      margin-top: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;

      .caption-text {
        font-size: 1.4rem;
        color: #2b1820;
        font-weight: 600;
        line-height: 1.2;
      }

      .caption-date {
        font-size: 0.75rem;
        color: #8c6a76;
        letter-spacing: 0.5px;
      }
    }

    /* Lightbox */
    .lightbox-overlay {
      position: fixed;
      inset: 0;
      background: rgba(8, 4, 12, 0.92);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      animation: fadeIn 0.3s ease;
    }

    .lightbox-content {
      position: relative;
      max-width: 650px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .lightbox-close {
      position: absolute;
      top: -46px;
      right: 0;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      font-size: 20px;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;

      &:hover {
        background: var(--rose-primary);
        transform: scale(1.1);
      }
    }

    .lightbox-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: #fff;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      transition: all 0.2s ease;
      z-index: 10;

      &:hover {
        background: var(--rose-primary);
        transform: translateY(-50%) scale(1.1);
      }

      &.nav-prev { left: -60px; }
      &.nav-next { right: -60px; }
    }

    .lightbox-polaroid {
      background: #fdfaf6;
      padding: 18px 18px 24px;
      border-radius: 8px;
      box-shadow: 0 30px 70px rgba(0, 0, 0, 0.8), 0 0 40px rgba(232, 99, 126, 0.25);
      width: 100%;
      max-width: 480px;
      text-align: center;
    }

    .lightbox-img-frame {
      width: 100%;
      aspect-ratio: 1 / 1;
      border-radius: 4px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .lightbox-info {
      margin-top: 18px;

      .lightbox-title {
        font-size: 1.8rem;
        color: #2b1820;
        margin-bottom: 6px;
      }

      .lightbox-meta {
        display: flex;
        justify-content: center;
        gap: 16px;
        font-size: 0.85rem;
        color: #8c6a76;
      }
    }

    /* Customizer */
    .customizer-overlay {
      position: fixed;
      inset: 0;
      background: rgba(10, 5, 14, 0.85);
      backdrop-filter: blur(10px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .customizer-modal {
      width: 100%;
      max-width: 620px;
      max-height: 85vh;
      overflow-y: auto;
      padding: 28px;
      text-align: left;
    }

    .customizer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      h3 {
        font-family: var(--font-serif);
        font-size: 1.4rem;
        color: #fff;
      }

      .close-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        font-size: 20px;
        cursor: pointer;
      }
    }

    .customizer-desc {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin-bottom: 20px;
      line-height: 1.5;
    }

    .customizer-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
    }

    .customizer-item {
      display: flex;
      gap: 14px;
      align-items: center;
      background: rgba(255, 255, 255, 0.04);
      padding: 12px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.08);

      .item-thumb {
        width: 68px;
        height: 68px;
        border-radius: 6px;
        overflow: hidden;
        flex-shrink: 0;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .item-fields {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;

        input[type="text"] {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #fff;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 0.85rem;
        }

        .upload-btn-label {
          display: inline-block;
          font-size: 0.82rem;
          color: var(--rose-light);
          cursor: pointer;

          input[type="file"] {
            display: none;
          }

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    .customizer-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @media (max-width: 640px) {
      .lightbox-nav.nav-prev { left: 10px; }
      .lightbox-nav.nav-next { right: 10px; }
    }
  `]
})
export class PhotoGalleryComponent {
  private music = inject(MusicService);

  public activePhotoIndex = signal<number | null>(null);
  public showCustomizer = signal<boolean>(false);

  private defaultPhotos: PolaroidPhoto[] = [
    {
      id: '0',
      url: 'photos/foto7.jpg',
      caption: 'Nuestra primera cita ☕',
      date: 'Donde empezó todo',
      location: 'Cafecito, nervios y miradas',
      rotation: -1.8
    },
    {
      id: '3',
      url: 'photos/foto3.jpg',
      caption: 'Nuestras muecas favoritas 😜',
      date: 'Risas sin parar',
      location: 'Haciendo tonterías juntos',
      rotation: -1.6
    },
    {
      id: '4',
      url: 'photos/foto4.jpg',
      caption: 'La abejita de mi corazón 🐝',
      date: 'Un detalle con amor',
      location: 'Bajo el cielo abierto',
      rotation: 2.2
    },
    {
      id: '5',
      url: 'photos/foto5.jpg',
      caption: 'ese dia me puse triste por tener que',
      date: 'Sonrisas que iluminan todo',
      location: 'Caminando de tu mano',
      rotation: -2.0
    },
    {
      id: '6',
      url: 'photos/foto6.jpg',
      caption: 'Te amo tanto, Pía Valentina ❤️',
      date: '26·10·2025',
      location: 'Nuestra locura favorita',
      rotation: 2.4
    }
  ];

  public photos = signal<PolaroidPhoto[]>([]);

  constructor() {
    this.loadPhotos();
  }

  public currentActivePhoto(): PolaroidPhoto | null {
    const idx = this.activePhotoIndex();
    if (idx === null) return null;
    return this.photos()[idx] || null;
  }

  public openLightbox(index: number): void {
    this.activePhotoIndex.set(index);
    this.music.playChimeSound();
  }

  public closeLightbox(): void {
    this.activePhotoIndex.set(null);
  }

  public nextPhoto(): void {
    const cur = this.activePhotoIndex();
    if (cur !== null) {
      const next = (cur + 1) % this.photos().length;
      this.activePhotoIndex.set(next);
    }
  }

  public prevPhoto(): void {
    const cur = this.activePhotoIndex();
    if (cur !== null) {
      const prev = (cur - 1 + this.photos().length) % this.photos().length;
      this.activePhotoIndex.set(prev);
    }
  }

  public openCustomizer(): void {
    this.showCustomizer.set(true);
  }

  public onFileUpload(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        this.photos.update(list => {
          const updated = [...list];
          updated[index] = { ...updated[index], url: base64 };
          return updated;
        });
        this.savePhotos();
      };
      reader.readAsDataURL(file);
    }
  }

  public onImgError(event: Event, index: number): void {
    // Fallback if image fails to load
    const img = event.target as HTMLImageElement;
    img.src = 'photos/foto2.jpg';
  }

  public savePhotos(): void {
    try {
      localStorage.setItem('saved_polaroid_photos_v6', JSON.stringify(this.photos()));
    } catch (e) {
      // quota or storage error
    }
  }

  public resetDefaultPhotos(): void {
    this.photos.set([...this.defaultPhotos]);
    try {
      localStorage.removeItem('saved_polaroid_photos_v6');
      localStorage.removeItem('saved_polaroid_photos_v5');
      localStorage.removeItem('saved_polaroid_photos_v4');
      localStorage.removeItem('saved_polaroid_photos_v3');
      localStorage.removeItem('saved_polaroid_photos');
    } catch (e) {}
  }

  private loadPhotos(): void {
    try {
      const saved = localStorage.getItem('saved_polaroid_photos_v6');
      if (saved) {
        this.photos.set(JSON.parse(saved));
        return;
      }
    } catch (e) {}
    this.photos.set([...this.defaultPhotos]);
  }
}
