import { Routes } from '@angular/router';
import { EventViewComponent } from './app/event-view/event-view.component';
import { AppComponent } from './app/overview/app.component';

export const routes: Routes = [
    { path: '', redirectTo: 'overview', pathMatch: 'full' },
    { path: 'overview', component: AppComponent },
    { path: 'signup/:id', component: EventViewComponent },
];
