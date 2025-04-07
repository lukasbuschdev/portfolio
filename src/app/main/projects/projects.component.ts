import { Component, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-projects',
  imports: [],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  language = inject(LanguageService);

  openLink(link: string): void {
    window.open(link, '_blank');
  }

  getProjects() {
    const translations: any = {
      en: [
        {
          name: 'Expense Tracker',
          technologies: 'Angular 19 | TypeScript | HTML | SCSS | Supabase | Node | Express',
          description: 'Expense Tracker is a full-stack application that simplifies financial management. Create an account to unlock a dynamic dashboard with graphical summaries, manage your expenses, budgets, and categories, and adjust your settings all in one intuitive interface.',
          img: 'img/expensetracker.png',
          link: 'https://expensetracker.lukasbusch.dev',
          github: 'https://github.com/lukasbuschdev/tracker'
        },
        {
          name: 'Join',
          technologies: 'JavaScript | HTML | CSS | Firebase',
          description: 'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users and categories.',
          img: 'img/join.png',
          link: 'https://lukasbusch.dev/Join/init/login/login.html',
          github: 'https://github.com/lukasbuschdev/Join'
        },
        {
          name: 'Pollo Loco',
          technologies: 'JavaScript | HTML | CSS',
          description: 'Jump, run and throw game based on object-oriented approach. Help Pepe to find coins and tabasco salsa to fight against the crazy hen.',
          img: 'img/polloloco.png',
          link: 'https://lukasbusch.dev/PolloLoco/index.html',
          github: 'https://github.com/lukasbuschdev/ElPolloLoco'
        },
        {
          name: 'Notes',
          technologies: 'JavaScript | HTML | CSS | Firebase',
          description: 'Create, edit, archive, and delete notes effortlessly with inbuilt search functionality. Available in 5 languages and downloadable for any device.',
          img: 'img/notes.png',
          link: 'https://lukasbusch.dev/Notes/index.html?fullscreen=true',
          github: 'https://github.com/lukasbuschdev/Notes'
        }
      ],
      es: [
        {
          name: 'Expense Tracker',
          technologies: 'Angular 19 | TypeScript | HTML | SCSS | Supabase | Node | Express',
          description: 'Expense Tracker es una aplicación full-stack que simplifica la gestión financiera. Crea una cuenta para acceder a un panel dinámico con resúmenes gráficos, gestiona tus gastos, presupuestos y categorías, y ajusta tu configuración, todo en una interfaz intuitiva.',
          img: 'img/expensetracker.png',
          link: 'https://expensetracker.lukasbusch.dev',
          github: 'https://github.com/lukasbuschdev/tracker'
        },
        {
          name: 'Join',
          technologies: 'JavaScript | HTML | CSS | Firebase',
          description: 'Administrador de tareas inspirado en el sistema Kanban. Crea y organiza tareas usando funciones de arrastrar y soltar, asignar usuarios y categorías.',
          img: 'img/join.png',
          link: 'https://lukasbusch.dev/Join/init/login/login.html',
          github: 'https://github.com/lukasbuschdev/Join'
        },
        {
          name: 'Pollo Loco',
          technologies: 'JavaScript | HTML | CSS',
          description: 'Juego de saltar, correr y lanzar basado en un enfoque orientado a objetos. Ayuda a Pepe a encontrar monedas y salsa tabasco para luchar contra la gallina loca.',
          img: 'img/polloloco.png',
          link: 'https://lukasbusch.dev/PolloLoco/index.html',
          github: 'https://github.com/lukasbuschdev/ElPolloLoco'
        },
        {
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
          name: 'Expense Tracker',
          technologies: 'Angular 19 | TypeScript | HTML | SCSS | Supabase | Node | Express',
          description: 'Expense Tracker ist eine Full-Stack-Anwendung, die das Finanzmanagement vereinfacht. Erstelle ein Konto, um ein dynamisches Dashboard mit grafischen Übersichten freizuschalten, verwalte deine Ausgaben, Budgets und Kategorien und passe deine Einstellungen in einer intuitiven Benutzeroberfläche an.',
          img: 'img/expensetracker.png',
          link: 'https://expensetracker.lukasbusch.dev',
          github: 'https://github.com/lukasbuschdev/tracker'
        },
        {
          name: 'Join',
          technologies: 'JavaScript | HTML | CSS | Firebase',
          description: 'Task-Manager inspiriert vom Kanban-System. Erstellen und organisieren Sie Aufgaben mit Drag-and-Drop-Funktionen, weisen Sie Benutzern und Kategorien zu.',
          img: 'img/join.png',
          link: 'https://lukasbusch.dev/Join/init/login/login.html',
          github: 'https://github.com/lukasbuschdev/Join'
        },
        {
          name: 'Pollo Loco',
          technologies: 'JavaScript | HTML | CSS',
          description: 'Spring-, Lauf- und Wurfspiel basierend auf einem objektorientierten Ansatz. Hilf Pepe, Münzen und Tabascosauce zu finden, um gegen die verrückte Henne zu kämpfen.',
          img: 'img/polloloco.png',
          link: 'https://lukasbusch.dev/PolloLoco/index.html',
          github: 'https://github.com/lukasbuschdev/ElPolloLoco'
        },
        {
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
