import { Component, Input } from '@angular/core';
import { typeCommand } from '../../types/types';

@Component({
  selector: 'app-ls',
  imports: [],
  templateUrl: './ls.component.html',
  styleUrl: './ls.component.scss'
})
export class LsComponent {
  @Input() executedCommand!: typeCommand;
}
