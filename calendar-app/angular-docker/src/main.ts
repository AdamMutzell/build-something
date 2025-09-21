import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/overview/app.config';
import { AppComponent } from './app/overview/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
