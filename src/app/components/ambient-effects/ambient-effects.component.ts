import { Component, ElementRef, OnInit, OnDestroy, ViewChild, inject, NgZone } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  rotation: number;
  rotSpeed: number;
  type: 'heart' | 'sparkle' | 'petal';
  color: string;
}

@Component({
  selector: 'app-ambient-effects',
  standalone: true,
  template: `
    <canvas #ambientCanvas class="ambient-canvas"></canvas>
  `,
  styles: [`
    :host {
      display: block;
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 1;
      overflow: hidden;
      transform: translateZ(0);
    }
    .ambient-canvas {
      width: 100%;
      height: 100%;
      display: block;
      will-change: contents;
    }
  `]
})
export class AmbientEffectsComponent implements OnInit, OnDestroy {
  @ViewChild('ambientCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ngZone = inject(NgZone);
  private ctx!: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private particles: Particle[] = [];
  private mouseX = -9999;
  private mouseY = -9999;

  private colors = [
    'rgba(247, 162, 180, ',
    'rgba(232, 99, 126, ',
    'rgba(229, 184, 105, ',
    'rgba(255, 215, 225, '
  ];

  ngOnInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d', { alpha: true })!;
    this.resizeCanvas();

    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('resize', this.onResize, { passive: true });
      window.addEventListener('mousemove', this.onMouseMove, { passive: true });

      this.initParticles();
      this.animate();
    });
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);
  }

  private onResize = (): void => {
    this.resizeCanvas();
  };

  private onMouseMove = (e: MouseEvent): void => {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  };

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private initParticles(): void {
    const count = 16;
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(true));
    }
  }

  private createParticle(randomY = false): Particle {
    const canvas = this.canvasRef.nativeElement;
    const types: ('heart' | 'sparkle' | 'petal')[] = ['heart', 'petal', 'sparkle', 'petal'];
    const chosenType = types[Math.floor(Math.random() * types.length)];
    const chosenColor = this.colors[Math.floor(Math.random() * this.colors.length)];

    return {
      x: Math.random() * canvas.width,
      y: randomY ? Math.random() * canvas.height : canvas.height + 20,
      size: chosenType === 'heart' ? Math.random() * 8 + 8 : Math.random() * 10 + 6,
      speedY: -(Math.random() * 0.8 + 0.4),
      speedX: (Math.random() - 0.5) * 0.6,
      opacity: Math.random() * 0.5 + 0.25,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      type: chosenType,
      color: chosenColor
    };
  }

  private animate = (): void => {
    if (document.hidden) {
      this.animationFrameId = requestAnimationFrame(this.animate);
      return;
    }
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;

      // Subtle reaction to mouse
      const dx = this.mouseX - p.x;
      const dy = this.mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120 && dist > 0) {
        p.x -= (dx / dist) * 0.8;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);

      if (p.type === 'heart') {
        this.drawHeart(p.size, `${p.color}${p.opacity})`);
      } else if (p.type === 'petal') {
        this.drawPetal(p.size, `${p.color}${p.opacity})`);
      } else {
        this.drawSparkle(p.size, `${p.color}${p.opacity})`);
      }

      this.ctx.restore();

      // Reset when particle goes above screen
      if (p.y < -30 || p.x < -30 || p.x > canvas.width + 30) {
        this.particles[i] = this.createParticle(false);
      }
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private drawHeart(size: number, fillStyle: string): void {
    this.ctx.fillStyle = fillStyle;
    this.ctx.beginPath();
    const topCurveHeight = size * 0.3;
    this.ctx.moveTo(0, topCurveHeight);
    // top left curve
    this.ctx.bezierCurveTo(-size / 2, -size * 0.4, -size, topCurveHeight, 0, size);
    // top right curve
    this.ctx.bezierCurveTo(size, topCurveHeight, size / 2, -size * 0.4, 0, topCurveHeight);
    this.ctx.fill();
  }

  private drawPetal(size: number, fillStyle: string): void {
    this.ctx.fillStyle = fillStyle;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, size * 0.5, size, Math.PI / 6, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  private drawSparkle(size: number, fillStyle: string): void {
    this.ctx.fillStyle = fillStyle;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
    this.ctx.fill();
  }
}
