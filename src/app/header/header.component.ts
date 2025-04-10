import { Component, inject } from '@angular/core';
import { ScrollService } from '../services/scroll.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  scroll = inject(ScrollService);
  router = inject(Router);

  toggleMenu(): void {
    this.router.url === '/main' ? this.router.navigate(['menu']) : this.router.navigate(['main']);
  }
}
