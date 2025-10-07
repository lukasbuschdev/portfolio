import { Component, inject } from '@angular/core';
import { ScrollService } from '../services/scroll.service';
import { TranslatePipe } from '../pipe/translate.pipe';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-footer',
  imports: [TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  scroll = inject(ScrollService);
  language = inject(LanguageService);

  currentYear: number | undefined = undefined; 
  
  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
  }

  openLink(link: string): void {
    if(link.includes('/cv/')) {
      link = link + this.language.currentLanguage + '.pdf';
    }

    window.open(link, '_blank');
  }
}
