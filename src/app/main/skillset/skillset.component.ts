import { Component } from '@angular/core';

@Component({
  selector: 'app-skillset',
  imports: [],
  templateUrl: './skillset.component.html',
  styleUrl: './skillset.component.scss'
})
export class SkillsetComponent {
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
      name: 'Scrum',
      img: 'img/scrum.svg'
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
      name: 'Node',
      img: 'img/node.svg'
    },
    {
      name: 'GIT',
      img: 'img/git.svg'
    },
    {
      name: 'CSS/SCSS',
      img: 'img/css.svg'
    },
    {
      name: 'REST-API',
      img: 'img/api.svg'
    },
    {
      name: 'Material Design',
      img: 'img/materialdesign.svg'
    },
    {
      name: 'Growth mindset',
      img: 'img/growth.svg'
    }
  ];
}
