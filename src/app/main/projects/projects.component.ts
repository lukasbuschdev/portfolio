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
          name: 'Lengo',
          technologies: 'Angular | TypeScript | SCSS | Node.js | Supabase | Stripe',
          description: 'Peer-to-peer rental platform (in development) where users can list and rent items locally with secure payments, reservation flow, user ratings and location-based search.',
          img: 'img/lengo.webp',
          link: 'https://lengoapp.com',
          github: ''
        },
        {
          name: 'Web CLI',
          technologies: 'Angular | TypeScript | SCSS | HTML | Node.js | Nginx',
          description: 'Browser-based CLI with 44+ commands (ls, cat, ping, dig etc.), file system navigation, built-in nano editor, command chaining and sudo support, realistic errors and live system data.',
          img: 'img/terminal.webp',
          link: 'https://lukasbusch.dev/cli',
          github: 'https://github.com/lukasbuschdev/cli'
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
        }
      ],
      es: [
        {
          name: 'Lengo',
          technologies: 'Angular | TypeScript | SCSS | Node.js | Supabase | Stripe',
          description: 'Plataforma de alquiler entre personas (en desarrollo) donde los usuarios pueden publicar y rentar artículos localmente con pagos seguros, flujo de reservas, valoraciones y búsqueda por ubicación.',
          img: 'img/lengo.webp',
          link: 'https://lengoapp.com',
          github: ''
        },
        {
          name: 'Web CLI',
          technologies: 'Angular | TypeScript | SCSS | HTML | Node.js | Nginx',
          description: 'CLI en el navegador con más de 44 comandos (ls, cat, ping, dig etc.), navegación de archivos, editor nano integrado, chaining y sudo, errores realistas y datos de sistema en vivo.',
          img: 'img/terminal.webp',
          link: 'https://lukasbusch.dev/cli',
          github: 'https://github.com/lukasbuschdev/cli'
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
        }
      ],
      de: [
        {
          name: 'Lengo',
          technologies: 'Angular | TypeScript | SCSS | Node.js | Supabase | Stripe',
          description: 'Peer-to-Peer-Mietplattform (in Entwicklung), auf der Nutzer Artikel lokal einstellen und mieten können – mit sicheren Zahlungen, Reservierungsablauf, Bewertungen und standortbasierter Suche.',
          img: 'img/lengo.webp',
          link: 'https://lengoapp.com',
          github: ''
        },
        {
          name: 'Web CLI',
          technologies: 'Angular | TypeScript | SCSS | HTML | Node.js | Nginx',
          description: 'Linux-ähnliche CLI im Browser mit 44+ Befehlen (ls, cat, ping, dig etc.), Dateisystem-Navigation, integriertem Nano-Editor, Befehlsketten und sudo, realistischen Fehlermeldungen und Live-Systemdaten.',
          img: 'img/terminal.webp',
          link: 'https://lukasbusch.dev/cli',
          github: 'https://github.com/lukasbuschdev/cli'
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
        }
      ]
    };

    return translations[this.language.currentLanguage];
  }
}
