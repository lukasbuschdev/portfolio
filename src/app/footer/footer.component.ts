import { Component, inject } from '@angular/core';
import { ScrollService } from '../services/scroll.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  scroll = inject(ScrollService);

  openLink(link: string): void {
    window.open(link, '_blank');
  }
}
