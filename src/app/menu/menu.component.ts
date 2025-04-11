import { Component, inject } from '@angular/core';
import { ScrollService } from '../services/scroll.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '../pipe/translate.pipe';

@Component({
  selector: 'app-menu',
  imports: [TranslatePipe],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  scroll = inject(ScrollService);
}
