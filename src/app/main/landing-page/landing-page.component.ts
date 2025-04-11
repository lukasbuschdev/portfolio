import { Component, inject } from '@angular/core';
import { ScrollService } from '../../services/scroll.service';
import { TranslatePipe } from '../../pipe/translate.pipe';

@Component({
  selector: 'app-landing-page',
  imports: [TranslatePipe],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  scroll = inject(ScrollService);

  openLink(link: string): void {
    window.open(link, '_blank');
  }
}
