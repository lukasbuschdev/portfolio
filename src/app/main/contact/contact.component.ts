import { Component, inject } from '@angular/core';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  isChecked: boolean = false;
  isSubmitAttempted: boolean = false;
  isValidName: boolean = false;
  isValidEmail: boolean = false;
  nameRegex: RegExp = /^[a-zA-Z ]*$/;
  emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  messageRegex: RegExp = /^[\p{L}\p{N}\s.,:;\-!?/&()]+$/u;

  scroll = inject(ScrollService);

  toggleChecked(): void {
    this.isChecked = !this.isChecked;
  }

  submit(name: string, email: string, message: string): void {
    this.isSubmitAttempted = true;

    const isValidInput = this.checkInputs(name, email, message);
    if(!isValidInput) return;

    console.log('Successful submitted!')
    this.resetFlags();
  }

  checkInputs(name: string, email: string, message: string): boolean {
    return this.nameRegex.test(name) &&
          this.emailRegex.test(email) &&
          this.messageRegex.test(message) &&
          this.isChecked;
  }

  resetFlags(): void {
    this.isSubmitAttempted = false;
    this.isValidName = false;
    this.isValidEmail = false;
    this.isChecked = false;
  }
}
