import { Component, inject } from '@angular/core';
import { ScrollService } from '../../services/scroll.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from '../../services/language.service';
import { TranslatePipe } from '../../pipe/translate.pipe';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, TranslatePipe],
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
  messageRegex: RegExp = /^[\p{L}\p{N}\s.,:;'\-+!?/&()]+$/u;
  name: string = '';
  email: string = '';
  message: string = '';

  http = inject(HttpClient);
  scroll = inject(ScrollService);
  language = inject(LanguageService);
  dialog = inject(DialogService);

  toggleChecked(): void {
    this.isChecked = !this.isChecked;
  }

  submit(name: string, email: string, message: string): void {
    this.isSubmitAttempted = true;

    const isValidInput = this.checkInputs(name, email, message);
    if(!isValidInput) return;

    this.resetFlags();
    this.sendMail(name, email, message);
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

  resetInputFields(): void {
    this.name = '';
    this.email = '';
    this.message = '';
  }


  // MAIL

  post = {
    endPoint: 'https://lukasbusch.dev/sendMail.php',
    body: (payload: any) => JSON.stringify(payload),
    options: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };

  sendMail(name: string, email: string, message: string): void {
    this.http.post(this.post.endPoint, this.post.body({
        name: name,
        email: email,
        message: message,
        language: this.language.currentLanguage
      })).subscribe({
        next: (response) => {
          console.log("Form submitted successfully", response);
          this.dialog.showDialog();
          this.resetInputFields();
        },
        error: (error) => {
          console.error("Form submission error", error);
        },
        complete: () => console.info('Form submission complete'),
    });
  }
}
