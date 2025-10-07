import { Component, inject } from '@angular/core';
import { ScrollService } from '../../services/scroll.service';
import { TranslatePipe } from '../../pipe/translate.pipe';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-landing-page',
  imports: [TranslatePipe],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  scroll = inject(ScrollService);
  language = inject(LanguageService);

  
  openLink(link: string): void {
    if(link.includes('/cv/')) {
      link = link + this.language.currentLanguage + '.pdf';
    }

    window.open(link, '_blank');
  }
}
