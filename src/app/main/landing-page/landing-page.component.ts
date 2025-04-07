import { Component, inject } from '@angular/core';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-landing-page',
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  scroll = inject(ScrollService);
}
