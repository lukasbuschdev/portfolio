import { Component } from '@angular/core';
import { MainComponent } from "./main/main.component";
import { FooterComponent } from "./footer/footer.component";
import { Effect } from './models/effect';
import { last } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [MainComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'portfolio';

  ngAfterViewInit(): void {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    let lastTime = 0;
    const fps = 30;
    const nextFrame = 1000/fps;
    let timer = 0;
    // '#0aff0a'

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let gradient = this.createGradient(ctx, canvas.width, canvas.height);

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      effect.resize(canvas.width, canvas.height);
      gradient = this.createGradient(ctx, canvas.width, canvas.height);
    });

    const effect = new Effect(canvas.width, canvas.height);

    this.animate(ctx, effect, canvas, 0, lastTime, nextFrame, timer, gradient);
  }

  animate(ctx: any, effect: Effect, canvas: any, timeStamp: any, lastTime: number, nextFrame: number, timer: number, gradient: any): void {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    if(timer > nextFrame) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.075)';
      ctx.textAlign = 'center'
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = gradient;
      ctx.font = effect.fontSize + 'px monospace';
      effect.symbols.forEach(symbol => symbol.draw(ctx));
      timer = 0;
    } else {
      timer += deltaTime;
    }

    requestAnimationFrame((newTimeStamp: number) => this.animate(ctx, effect, canvas, newTimeStamp, lastTime, nextFrame, timer, gradient));
  }

  private createGradient(ctx: CanvasRenderingContext2D, width: number, height: number): CanvasGradient {
    const gradient = ctx.createRadialGradient(width/2, height/2, 200, width/2, height/2, 500);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.5, '#003300');
    gradient.addColorStop(0.75, '#0aff0a');
    gradient.addColorStop(1, '#00eeff');
    return gradient;
  }
}
