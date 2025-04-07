import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  scrollToSection(id: string): void {
    const section = document.getElementById(id);

    if(section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
