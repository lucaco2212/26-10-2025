import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmbientEffectsComponent } from './components/ambient-effects/ambient-effects.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { LetterEnvelopeComponent } from './components/letter-envelope/letter-envelope.component';
import { PhotoGalleryComponent } from './components/photo-gallery/photo-gallery.component';
import { FutureDreamComponent } from './components/future-dream/future-dream.component';
import { LoveVideoComponent } from './components/love-video/love-video.component';
import { TimeMessageComponent } from './components/time-message/time-message.component';
import { FooterSectionComponent } from './components/footer-section/footer-section.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    AmbientEffectsComponent,
    HeroSectionComponent,
    LetterEnvelopeComponent,
    PhotoGalleryComponent,
    FutureDreamComponent,
    LoveVideoComponent,
    TimeMessageComponent,
    FooterSectionComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // 26·10·2025 - Para mi amor Pía Valentina ❤️
}
