import { Component, inject } from '@angular/core';
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { AboutMeComponent } from "./about-me/about-me.component";
import { SkillsetComponent } from "./skillset/skillset.component";
import { ProjectsComponent } from "./projects/projects.component";
import { ContactComponent } from "./contact/contact.component";
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";
import { DialogService } from '../services/dialog.service';

@Component({
  selector: 'app-main',
  imports: [LandingPageComponent, AboutMeComponent, SkillsetComponent, ProjectsComponent, ContactComponent, ConfirmationDialogComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  dialog = inject(DialogService);
}
