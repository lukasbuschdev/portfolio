import { Component, inject } from '@angular/core';
import { TranslatePipe } from '../../pipe/translate.pipe';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-about-me',
  imports: [TranslatePipe],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.scss'
})
export class AboutMeComponent {
  scroll = inject(ScrollService);
}
