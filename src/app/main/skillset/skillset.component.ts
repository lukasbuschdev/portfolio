import { Component, inject } from '@angular/core';
import { TranslatePipe } from '../../pipe/translate.pipe';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-skillset',
  imports: [TranslatePipe],
  templateUrl: './skillset.component.html',
  styleUrl: './skillset.component.scss'
})
export class SkillsetComponent {
  scroll = inject(ScrollService);

  skillset = [
    {
      name: 'Angular',
      img: 'img/angular.svg'
    },
    {
      name: 'TypeScript',
      img: 'img/ts.svg'
    },
    {
      name: 'JavaScript',
      img: 'img/js.svg'
    },
    {
      name: 'HTML',
      img: 'img/html.svg'
    },
    {
      name: 'CSS/SCSS',
      img: 'img/css.svg'
    },
    {
      name: 'Node',
      img: 'img/node.svg'
    },
    {
      name: 'REST-API',
      img: 'img/api.svg'
    },
    {
      name: 'Supabase',
      img: 'img/supabase.svg'
    },
    {
      name: 'Firebase',
      img: 'img/firebase.svg'
    },
    {
      name: 'GIT',
      img: 'img/git.svg'
    },
    {
      name: 'Material Design',
      img: 'img/materialdesign.svg'
    },
    {
      name: 'Scrum',
      img: 'img/scrum.svg'
    },
    {
      name: 'Growth Mindset',
      img: 'img/growth.svg'
    }
  ];
}
