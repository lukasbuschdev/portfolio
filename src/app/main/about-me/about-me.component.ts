import { Component } from '@angular/core';
import { TranslatePipe } from '../../pipe/translate.pipe';

@Component({
  selector: 'app-about-me',
  imports: [TranslatePipe],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.scss'
})
export class AboutMeComponent {

}
