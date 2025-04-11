import { Component, inject } from '@angular/core';
import { ScrollService } from '../services/scroll.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '../pipe/translate.pipe';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-header',
  imports: [TranslatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  scroll = inject(ScrollService);
  router = inject(Router);
  language = inject(LanguageService);

  toggleMenu(): void {
    this.router.url === '/main' ? this.router.navigate(['menu']) : this.router.navigate(['main']);
  }
}
