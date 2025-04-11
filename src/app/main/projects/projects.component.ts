import { Component, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { TranslatePipe } from '../../pipe/translate.pipe';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-projects',
  imports: [TranslatePipe],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  language = inject(LanguageService);
  scroll = inject(ScrollService);

  openLink(link: string): void {
    window.open(link, '_blank');
  }

  getProjects() {
    const translations: any = {
      en: [
        {
          id: '0',
          name: 'Expense Tracker',
          technologies: 'Angular | TypeScript | HTML | SCSS | Supabase | Node | Express',
          description: 'Expense Tracker is a full-stack financial management app. Create an account to access a dynamic dashboard that lets you manage expenses, budgets, and settings in one interface.',
          img: 'img/expensetracker.png',
          link: 'https://expensetracker.lukasbusch.dev',
          github: 'https://github.com/lukasbuschdev/tracker'
        },
        {
          id: '1',
          name: 'Join',
          technologies: 'JavaScript | HTML | CSS | Firebase',
          description: 'Task Manager, inspired by the Kanban system, lets you create and organize tasks with drag-and-drop ease. Assign users and categories to manage your workflow and improve task tracking.',
          img: 'img/join.png',
          link: 'https://lukasbusch.dev/Join/init/login/login.html',
          github: 'https://github.com/lukasbuschdev/Join'
        },
        {
          id: '2',
          name: 'Pollo Loco',
          technologies: 'JavaScript | HTML | CSS',
          description: 'Jump, run, and throw game built with an object-oriented approach. Help Pepe find coins and tabasco salsa to battle the crazy hen in an exciting quest.',
          img: 'img/polloloco.png',
          link: 'https://lukasbusch.dev/PolloLoco/index.html',
          github: 'https://github.com/lukasbuschdev/ElPolloLoco'
        },
        {
          id: '3',
          name: 'Notes',
          technologies: 'JavaScript | HTML | CSS | Firebase',
          description: 'Create, edit, archive, and delete notes effortlessly with inbuilt search functionality. Available in 5 languages and as PWA.',
          img: 'img/notes.png',
          link: 'https://lukasbusch.dev/Notes/index.html?fullscreen=true',
          github: 'https://github.com/lukasbuschdev/Notes'
        }
      ],
      es: [
        {
          id: '0',
          name: 'Expense Tracker',
          technologies: 'Angular | TypeScript | HTML | SCSS | Supabase | Node | Express',
          description: 'Expense Tracker es una aplicación full-stack que simplifica la gestión financiera. Crea una cuenta para acceder a un panel dinámico con resúmenes gráficos, gestiona tus gastos, presupuestos y categorías, y ajusta tu configuración, todo en una interfaz intuitiva.',
          img: 'img/expensetracker.png',
          link: 'https://expensetracker.lukasbusch.dev',
          github: 'https://github.com/lukasbuschdev/tracker'
        },
        {
          id: '1',
          name: 'Join',
          technologies: 'JavaScript | HTML | CSS | Firebase',
          description: 'Administrador de tareas inspirado en el sistema Kanban. Crea y organiza tareas usando funciones de arrastrar y soltar, asignar usuarios y categorías.',
          img: 'img/join.png',
          link: 'https://lukasbusch.dev/Join/init/login/login.html',
          github: 'https://github.com/lukasbuschdev/Join'
        },
        {
          id: '2',
          name: 'Pollo Loco',
          technologies: 'JavaScript | HTML | CSS',
          description: 'Juego de saltar, correr y lanzar basado en un enfoque orientado a objetos. Ayuda a Pepe a encontrar monedas y salsa tabasco para luchar contra la gallina loca.',
          img: 'img/polloloco.png',
          link: 'https://lukasbusch.dev/PolloLoco/index.html',
          github: 'https://github.com/lukasbuschdev/ElPolloLoco'
        },
        {
          id: '3',
          name: 'Notas',
          technologies: 'JavaScript | HTML | CSS | Firebase',
          description: 'Crea, edita, archiva y elimina notas fácilmente con funcionalidad de búsqueda incorporada. Disponible en 5 idiomas y descargable para cualquier dispositivo.',
          img: 'img/notes.png',
          link: 'https://lukasbusch.dev/Notes/index.html?fullscreen=true',
          github: 'https://github.com/lukasbuschdev/Notes'
        }
      ],
      de: [
        {
          id: '0',
          name: 'Expense Tracker',
          technologies: 'Angular | TypeScript | HTML | SCSS | Supabase | Node | Express',
          description: 'Expense Tracker ist eine Full-Stack-Anwendung, die das Finanzmanagement vereinfacht. Erstelle ein Konto, um ein dynamisches Dashboard mit grafischen Übersichten freizuschalten, verwalte deine Ausgaben, Budgets und Kategorien und passe deine Einstellungen in einer intuitiven Benutzeroberfläche an.',
          img: 'img/expensetracker.png',
          link: 'https://expensetracker.lukasbusch.dev',
          github: 'https://github.com/lukasbuschdev/tracker'
        },
        {
          id: '1',
          name: 'Join',
          technologies: 'JavaScript | HTML | CSS | Firebase',
          description: 'Task-Manager inspiriert vom Kanban-System. Erstellen und organisieren Sie Aufgaben mit Drag-and-Drop-Funktionen, weisen Sie Benutzern und Kategorien zu.',
          img: 'img/join.png',
          link: 'https://lukasbusch.dev/Join/init/login/login.html',
          github: 'https://github.com/lukasbuschdev/Join'
        },
        {
          id: '2',
          name: 'Pollo Loco',
          technologies: 'JavaScript | HTML | CSS',
          description: 'Spring-, Lauf- und Wurfspiel basierend auf einem objektorientierten Ansatz. Hilf Pepe, Münzen und Tabascosauce zu finden, um gegen die verrückte Henne zu kämpfen.',
          img: 'img/polloloco.png',
          link: 'https://lukasbusch.dev/PolloLoco/index.html',
          github: 'https://github.com/lukasbuschdev/ElPolloLoco'
        },
        {
          id: '3',
          name: 'Notizen',
          technologies: 'JavaScript | HTML | CSS | Firebase',
          description: 'Erstellen, bearbeiten, archivieren und löschen Sie Notizen mühelos mit eingebauter Suchfunktionalität. In 5 Sprachen verfügbar und für jedes Gerät herunterladbar.',
          img: 'img/notes.png',
          link: 'https://lukasbusch.dev/Notes/index.html?fullscreen=true',
          github: 'https://github.com/lukasbuschdev/Notes'
        }
      ]
    };

    return translations[this.language.currentLanguage];
  }
}
