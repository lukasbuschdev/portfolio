import { Component, inject } from '@angular/core';
import { TranslatePipe } from '../pipe/translate.pipe';
import { DialogService } from '../services/dialog.service';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [TranslatePipe],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
  dialog = inject(DialogService);
}
