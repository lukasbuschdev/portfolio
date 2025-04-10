import { Component, inject } from '@angular/core';
import { ScrollService } from '../services/scroll.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  scroll = inject(ScrollService);
}
