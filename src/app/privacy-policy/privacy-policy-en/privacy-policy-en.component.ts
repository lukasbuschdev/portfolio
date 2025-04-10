import { Component, inject } from '@angular/core';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-privacy-policy-en',
  imports: [],
  templateUrl: './privacy-policy-en.component.html',
  styleUrl: './privacy-policy-en.component.scss'
})
export class PrivacyPolicyEnComponent {
  scroll = inject(ScrollService);
}
