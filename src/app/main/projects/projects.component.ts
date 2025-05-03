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
          name: 'Interactive Terminal',
          technologies: 'Angular | TypeScript | SCSS | HTML | Node.js | Flask',
          description: 'Real Linux-style CLI in your browser: run 28+ commands (ls, cat, ping, dig), full file navigation, embedded nano editor, chaining & sudo auth, authentic errors and live data.',
          img: 'img/terminal.webp',
          link: 'https://lukasbusch.dev/cmd',
          github: 'https://github.com/lukasbuschdev/portfolio'
        },
        {
          name: 'Expense Tracker',
          technologies: 'Angular | TypeScript | HTML | SCSS | Supabase | Node.js | Express',
          description: 'Expense Tracker is a full-stack financial management app. Create an account to access a dynamic dashboard that lets you manage expenses, budgets, and settings in one interface.',
          img: 'img/expensetracker.webp',
          link: 'https://expensetracker.lukasbusch.dev',
          github: 'https://github.com/lukasbuschdev/tracker'
        },
        {
          name: 'Join',
          technologies: 'JavaScript | HTML | CSS | Firebase',
          description: 'Task Manager, inspired by the Kanban system, lets you create and organize tasks with drag-and-drop ease. Assign users and categories to manage your workflow and improve task tracking.',
          img: 'img/join.webp',
          link: 'https://lukasbusch.dev/Join/init/login/login.html',
          github: 'https://github.com/lukasbuschdev/Join'
        },
        {
          name: 'Pollo Loco',
          technologies: 'JavaScript | HTML | CSS',
          description: 'Jump, run, and throw game built with an object-oriented approach. Help Pepe find coins and tabasco salsa to battle the crazy hen in an exciting quest.',
          img: 'img/polloloco.webp',
          link: 'https://lukasbusch.dev/PolloLoco/index.html',
          github: 'https://github.com/lukasbuschdev/ElPolloLoco'
        },
        {
          name: 'Tax Calculator',
          technologies: 'Angular | HTML | SCSS | REST-API',
          description: 'Estimate your net take-home pay in Mexico: choose currency and pay frequency, enter your salary, and view monthly and yearly after-tax amounts with real-time exchange rates.',
          img: 'img/calculator.webp',
          link: 'https://lukasbusch.dev/Calculator/main',
          github: 'https://github.com/lukasbuschdev/calculator'
        },
        {
          name: 'Notes',
          technologies: 'JavaScript | HTML | CSS | Firebase',
          description: 'Create, edit, archive, and delete notes effortlessly with inbuilt search functionality. Available in 5 languages and as PWA.',
          img: 'img/notes.webp',
          link: 'https://lukasbusch.dev/Notes/index.html?fullscreen=true',
          github: 'https://github.com/lukasbuschdev/Notes/tree/main/Notes'
        }
      ],
      es: [
        {
          name: 'Interactive Terminal',
          technologies: 'Angular | TypeScript | SCSS | HTML | Node.js | Flask',
          description: 'Terminal Linux en el navegador: +28 comandos (ls, cat, ping…), navegación de archivos, editor nano, chaining y sudo, errores reales y datos en vivo.',
          img: 'img/terminal.webp',
          link: 'https://lukasbusch.dev/cmd',
          github: 'https://github.com/lukasbuschdev/portfolio'
        },        
        {
          name: 'Expense Tracker',
          technologies: 'Angular | TypeScript | HTML | SCSS | Supabase | Node.js | Express',
          description: 'Expense Tracker: gestor financiero full-stack con registro de usuarios, panel con gráficos, control de gastos, presupuestos y categorías en una interfaz intuitiva.',
          img: 'img/expensetracker.webp',
          link: 'https://expensetracker.lukasbusch.dev',
          github: 'https://github.com/lukasbuschdev/tracker'
        },        
        {
          name: 'Join',
          technologies: 'JavaScript | HTML | CSS | Firebase',
          description: 'Administrador de tareas inspirado en el sistema Kanban. Crea y organiza tareas usando funciones de arrastrar y soltar, asignar usuarios y categorías.',
          img: 'img/join.webp',
          link: 'https://lukasbusch.dev/Join/init/login/login.html',
          github: 'https://github.com/lukasbuschdev/Join'
        },
        {
          name: 'Pollo Loco',
          technologies: 'JavaScript | HTML | CSS',
          description: 'Juego de saltar, correr y lanzar basado en un enfoque orientado a objetos. Ayuda a Pepe a encontrar monedas y salsa tabasco para luchar contra la gallina loca.',
          img: 'img/polloloco.webp',
          link: 'https://lukasbusch.dev/PolloLoco/index.html',
          github: 'https://github.com/lukasbuschdev/ElPolloLoco'
        },
        {
          name: 'Calculadora de Impuestos',
          technologies: 'Angular | HTML | SCSS | API REST',
          description: 'Calcula tu salario neto en México: selecciona moneda y frecuencia de pago, ingresa tu salario y consulta montos mensuales y anuales después de impuestos con tasas de cambio en tiempo real.',
          img: 'img/calculator.webp',
          link: 'https://lukasbusch.dev/Calculator/main',
          github: 'https://github.com/lukasbuschdev/calculator'
        },        
        {
          name: 'Notas',
          technologies: 'JavaScript | HTML | CSS | Firebase',
          description: 'Crea, edita, archiva y elimina notas fácilmente con funcionalidad de búsqueda incorporada. Disponible en 5 idiomas y descargable para cualquier dispositivo.',
          img: 'img/notes.webp',
          link: 'https://lukasbusch.dev/Notes/index.html?fullscreen=true',
          github: 'https://github.com/lukasbuschdev/Notes/tree/main/Notes'
        }
      ],
      de: [
        {
          name: 'Interaktives Terminal',
          technologies: 'Angular | TypeScript | SCSS | HTML | Node.js | Flask',
          description: 'Echte Linux-CLI im Browser: 28+ Befehle (ls, cat, ping, dig), vollständige Dateinavigation, integrierter Nano-Editor, Befehlsketten & sudo, authentische Fehlermeldungen & Live-Daten.',
          img: 'img/terminal.webp',
          link: 'https://lukasbusch.dev/cmd',
          github: 'https://github.com/lukasbuschdev/portfolio'
        },        
        {
          name: 'Expense Tracker',
          technologies: 'Angular | TypeScript | HTML | SCSS | Supabase | Node.js | Express',
          description: 'Full-Stack-Finanzverwaltung im Browser: Konto erstellen, um ein dynamisches Dashboard mit Grafiken zu nutzen, verwalte Ausgaben, Budgets & Kategorien und passe Einstellungen in einer intuitiven UI an.',
          img: 'img/expensetracker.webp',
          link: 'https://expensetracker.lukasbusch.dev',
          github: 'https://github.com/lukasbuschdev/tracker'
        },
        {
          name: 'Join',
          technologies: 'JavaScript | HTML | CSS | Firebase',
          description: 'Task-Manager inspiriert vom Kanban-System. Erstellen und organisieren Sie Aufgaben mit Drag-and-Drop-Funktionen, weisen Sie Benutzern und Kategorien zu.',
          img: 'img/join.webp',
          link: 'https://lukasbusch.dev/Join/init/login/login.html',
          github: 'https://github.com/lukasbuschdev/Join'
        },
        {
          name: 'Pollo Loco',
          technologies: 'JavaScript | HTML | CSS',
          description: 'Spring-, Lauf- und Wurfspiel basierend auf einem objektorientierten Ansatz. Hilf Pepe, Münzen und Tabascosauce zu finden, um gegen die verrückte Henne zu kämpfen.',
          img: 'img/polloloco.webp',
          link: 'https://lukasbusch.dev/PolloLoco/index.html',
          github: 'https://github.com/lukasbuschdev/ElPolloLoco'
        },
        {
          name: 'Steuerrechner',
          technologies: 'Angular | HTML | SCSS | REST-API',
          description: 'Berechne dein Nettogehalt in Mexiko: wähle Währung und Zahlungsfrequenz, gib dein Gehalt ein und erhalte monatliche und jährliche Beträge nach Steuern mit Echtzeit-Wechselkursen.',
          img: 'img/calculator.webp',
          link: 'https://lukasbusch.dev/Calculator/main',
          github: 'https://github.com/lukasbuschdev/calculator'
        },        
        {
          name: 'Notizen',
          technologies: 'JavaScript | HTML | CSS | Firebase',
          description: 'Erstellen, bearbeiten, archivieren und löschen Sie Notizen mühelos mit eingebauter Suchfunktionalität. In 5 Sprachen verfügbar und für jedes Gerät herunterladbar.',
          img: 'img/notes.webp',
          link: 'https://lukasbusch.dev/Notes/index.html?fullscreen=true',
          github: 'https://github.com/lukasbuschdev/Notes/tree/main/Notes'
        }
      ]
    };

    return translations[this.language.currentLanguage];
  }
}
