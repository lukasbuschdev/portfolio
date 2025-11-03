import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { MenuComponent } from './menu/menu.component';

export const routes: Routes = [
    { path: '', redirectTo: 'main', pathMatch: 'full' },
    { path: 'main', component: MainComponent },
    { path: 'menu', component: MenuComponent },

    {
        path: 'privacy-policy', 
        loadComponent: () =>
            import('./privacy-policy/privacy-policy.component').then((m) => m.PrivacyPolicyComponent),
    },
    {
        path: 'legal-notice',
        loadComponent: () =>
            import('./legal-notice/legal-notice.component').then((m) => m.LegalNoticeComponent),
    }
];
